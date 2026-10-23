import {graphQlClient, supabase} from "./supabase";

export async function getCurrentUserOrders(){
    let allEdges = [];
    let hasNextPage = true;
    let cursor = null;

    while(hasNextPage){
        const query = `
            query {
                ordersCollection(
                first: 100,
                ${cursor ? `after: "${cursor}",` : ""}
                orderBy: [{ id: AscNullsFirst }]
                ){
                    edges{
                        node{
                            id
                            userId
                            productId
                            orderid
                            paymentMethod
                            address{
                                city
                                state
                                houseNo
                                pincode
                                locality
                                userName
                                userMobNo
                            }
                            productDetails{
                                brand
                                itemName
                                size
                                quantity
                                price
                                discountPrice
                                itemImage
                            }
                            userRating{
                                orderReview
                                date
                                orderRating
                            }
                        }
                        cursor
                    }
                    pageInfo{
                        hasNextPage
                        endCursor
                    }
                }
            }
        `;
        const data = await graphQlClient.request(query);
        const edges = data?.ordersCollection?.edges || [];
        allEdges = [...allEdges, ...edges];

        hasNextPage = data?.ordersCollection?.pageInfo?.hasNextPage;
        cursor = data?.ordersCollection?.pageInfo?.endCursor;

        if (!hasNextPage || edges.length === 0) break;
    }
    return allEdges.map(edge => {
        const details = JSON.parse(edge.node.productDetails);
        const rating = JSON.parse(edge.node.userRating);
        const address = JSON.parse(edge.node.address);

        return {
            ...edge.node,
            productDetails: details,
            userRating: rating,
            address: address
        };
    });
    // const {data, error} = await supabase.from("orders").select("*").order('id', { ascending: true })

    // if(error){
    //     console.log(error.message)
    // }

    // return data;
}

export async function setRating(userRating, id){
    const query = `
        mutation{
            updateordersCollection(
                data: {userRating: "${JSON.stringify(userRating)}"}
                filter: {id: {eq: "${id}"}}
            ){
                affectedCount
                records{
                    id
                    userRating
                }
            }
        }
    `
    const data = await graphQlClient.request(query);

    // const {data, error} = await supabase
    //     .from("orders")
    //     .update({userRating})
    //     .eq("id", id).select().single();

    //     if(error){
    //         throw new Error(error.message)
    //     }

        return data.updateOrders.records;
}

