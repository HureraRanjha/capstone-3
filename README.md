# Hurera's GameStore #

## Description
This is a full stack video game store using a Java Spring Boot REST API on the back end 
and HTML/CSS/JavaScript for the frontend. Users can register and log in, look for games 
and accessories, filter by Category, Price, and Genre. Add items to a shopping cart, 
update profile, and check out info. 

## Features
- JWT Auth (user and admin roles)
- Admin-only create / update / delete for categories and products
- Shopping cart: add games, increase quantity, clear cart
- View and update profile

## Running the code
- Clone the repo
- Open the backend project 
- Create the MYSQL database by running the file `backend/database/create_database_videogamestore.sql`
- Set MYSQL username/password in `backend/src/main/resources/application.properties`
- Run `ECommerceApplication.java` to run the Spring Boot App
- Open `frontend/capstone-client-videogamestore/index.html` and run it to view the frontend

## The Code I'm Most Proud of
I am proud of the addByUserIdAndProductId() method because the data models of the CartItem 
and the ShoppingCart were hard to grasp. This method adds a CartItem to a ShoppingCart. 
The method checks if the item already exists and if it does it increases the quantity by 1
otherwise it creates a new cart item.

```java
public ShoppingCart addByUserIdAndProductId(int userId, int productId)
    {
        CartItem cartItem = shoppingCartRepository.findByUserIdAndProductId(userId, productId);

        CartItem newItem = new CartItem();

        newItem.setProductId(productId);
        newItem.setUserId(userId);

        if (cartItem != null)
        {
            int productQuantity = cartItem.getQuantity() + 1;
            cartItem.setQuantity(productQuantity);
            shoppingCartRepository.save(cartItem);
        }
        else
        {
            shoppingCartRepository.save(newItem);
        }
        return getByUserId(userId);
    }
```

## My Personal Challenges
My biggest challenge was understanding the relationship between shopping cart item and cart item
as in the database the schema referenced the cart item in the shopping_cart column. As well as
remembering the `@Transactional` annotation to ensure the operation is atomic

## Next time 
I want to change the data model so its more consolidated. As well as add a way for the users to see the order history
and give some recommendations on their past purchases. Add a landing page, add stripe