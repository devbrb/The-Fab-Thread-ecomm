import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewCartEntry } from "../../services/apiCart";
import toast from "react-hot-toast";

export function useAddToCart() {
  const queryClient = useQueryClient();

  const { mutate: addToCartFn, isPending: isAddingCart } = useMutation({
    mutationFn: ({ entry, id }) => createNewCartEntry(entry, id),

    //OPTIMISTIC UI
    onMutate: async ({ entry, id }) => {
      // 1. Cancel ongoing cart fetches api calls
      await queryClient.cancelQueries({ queryKey: ["entries"] });

      // 2. take Snapshot of current cart for rollback
      const previousEntries = queryClient.getQueryData(["entries"]);

      toast.success("Product added to cart");

      // 3. Optimistically update cart
      queryClient.setQueryData(["entries"], (old = []) => {

        if (id) {
          return old.map((item) =>
            item.id === id
              ? { ...item, quantity: entry.quantity, optimistic: true }
              : item
          );
        }

        return [
          ...old,
          {
            id: "temp-" + Date.now(),
            ...entry,
            optimistic: true,
          },
        ];
      });

      // 4. Return snapshot for rollback
      return { previousEntries };
    },

    // If API fails → rollback
    onError: (error, variables, context) => {
      queryClient.setQueryData(["entries"], context.previousEntries);
      console.error(error.message);
      toast.error("Failed to add product. Try again.");
    },

    // If success or error → always resync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  return { addToCartFn, isAddingCart };
}
