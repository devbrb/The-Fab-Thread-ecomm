import { useEffect, useRef } from "react"
import useFocus from "../../Hooks/useFocus";
import Input from "./Input";
import FormRow from "./FormRow";
import FormError from "./FormError";

function CreditDebitCard({setIsCardData}) {
    const ref = useRef([]);

    //custom hook for focusing on input field
    useFocus(ref)

    useEffect(() => {
        function handleBlur(index){
            const value = ref.current[index].value
            const sibling = ref.current[index].nextElementSibling;

            //validation for empty fields
            if(!value){
                if(sibling){
                    sibling.classList.remove("hide");
                }
            }

            //Validation for card number
            if(value && index === 0){
                if(!(/^\d+$/.test(value))){
                    sibling.classList.remove("hide");
                    return sibling.innerText = "Invalid card, card number should be numeric"
                }
                if(value.length < 14 || value.length > 19){
                    sibling.classList.remove("hide");
                    return sibling.innerText = "Invalid card, please enter valid card number"
                }

                let sum = 0;
                let shouldDouble = false;
                const cardNumber = value.replace(/\D/g, '');

                for(let i = cardNumber.length - 1; i >= 0; i--){
                    let digit = parseInt(cardNumber.charAt(i), 10)

                    if(shouldDouble){
                        digit *= 2

                        if(digit > 9){
                            digit -= 9
                        }
                    }
                    sum += digit;
                    shouldDouble = !shouldDouble;
                }
                if(!(sum % 10 === 0)){
                    sibling.classList.remove("hide");
                    sibling.innerText = "Invalid card, please enter valid card number"
                }
            }

            //validation for expiry
            if(value && index === 2) {
                const currDate = new Date();
                const [expiredMonth, expiredYear] = value.split("/").map((num) => parseInt(num, 10));
                const fullYear = 2000 + expiredYear;
                const expiry = new Date(fullYear, expiredMonth - 1);

                if(currDate > expiry){
                    sibling.classList.remove("hide");
                    sibling.innerText = "Card is expired"
                }
            }
            const isValid = ref.current.every((inputRef) => inputRef.value.trim() !== "")
            if(isValid){
                setIsCardData(true)
            }
        }
        //logic for converting date into  MM/YY format
        function handleInput(index){
            if(index === 2){
                let value = ref.current[index].value

                value = value.replace(/\D/g, '');

                if(value.length >= 1){
                    let month = parseInt(value.substring(0, 1), 10);
                    if(month >= 2 && month <= 9){
                        value = '0' + value
                    }
                    if(value === "00"){
                        value = "01"
                    }
                }

                if(value.length >= 3){
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                if(value.length > 5){
                    value = value.substring(0, 5)
                }

                ref.current[index].value = value
            }
        }

        ref.current.forEach((inputEle, index) => {
            if(inputEle){
                inputEle.addEventListener("blur", () => handleBlur(index));
                if(index === 2) inputEle.addEventListener("input", () => handleInput(index));
            }
        }) 
        return () => {
            ref.current.forEach((inputEle, index) => {
                if(inputEle){
                    inputEle.removeEventListener("blur", () => handleBlur(index));
                    if(index === 2) inputEle.removeEventListener("input", () => handleInput(index));
                }
            })
        }
    }, [ref])

    return (
        <div className="card-container">
           <span className="card-heading">Credit/Debit Card</span>
           <form>
                <div className="card-details-box">
                     <div className="card-name-num">
                         <FormRow>
                             <Input type="text" elRef={(el) => (ref.current[0] = el)} placeholder="Card Number"/>
                             <FormError>Required</FormError>
                         </FormRow>

                         <FormRow>
                             <Input type="text" className="card-nameOncard card-input-width input-field" elRef={(el) => (ref.current[1] = el)} placeholder="Name on Card"/>
                             <FormError>Required</FormError>
                         </FormRow>

                         <FormRow>
                             <Input type="text" className="card-expiry input-field" elRef={(el) => (ref.current[2] = el)} placeholder="Expiry (MM/YY)" />
                             <FormError>Required</FormError>
                         </FormRow>
                         <FormRow>
                             <Input type="password" maxLength={3} className="card-cvvNum input-field" elRef={(el) => (ref.current[3] = el)} placeholder="CVV" />
                             <FormError>Required</FormError>
                         </FormRow>
                     </div>
                </div>
           </form>
        </div>
    )
}

export default CreditDebitCard
