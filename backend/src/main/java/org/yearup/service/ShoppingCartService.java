package org.yearup.service;

import org.springframework.stereotype.Service;
import org.yearup.models.CartItem;
import org.yearup.models.Product;
import org.yearup.models.ShoppingCart;
import org.yearup.models.ShoppingCartItem;
import org.yearup.repository.ShoppingCartRepository;

import java.util.List;

@Service
public class ShoppingCartService
{
    // a shopping cart is built from cart rows plus a product lookup for each row
    private final ShoppingCartRepository shoppingCartRepository;
    private final ProductService productService;

    public ShoppingCartService(ShoppingCartRepository shoppingCartRepository, ProductService productService)
    {
        this.shoppingCartRepository = shoppingCartRepository;
        this.productService = productService;
    }

    public ShoppingCart getByUserId(int userId)
    {
        // load the user's cart rows, look up each product, and build the ShoppingCart
        ShoppingCart shoppingCart = new ShoppingCart();

        List<CartItem> cartItemsList = shoppingCartRepository.findByUserId(userId);

        for(CartItem c: cartItemsList)
        {
            int productID = c.getProductId();
            int productQuantity = c.getQuantity();

            Product product = productService.getById(productID);
            ShoppingCartItem shoppingCartItem = new ShoppingCartItem();

            shoppingCartItem.setProduct(product);
            shoppingCartItem.setQuantity(productQuantity);

            shoppingCart.add(shoppingCartItem);
        }

        return shoppingCart;
    }



    // add additional methods here
}
