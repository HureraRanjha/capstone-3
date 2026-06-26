package org.yearup.service;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.yearup.models.Order;
import org.yearup.models.Profile;
import org.yearup.models.ShoppingCart;
import org.yearup.repository.OrderRepository;

import java.time.LocalDateTime;

@Service
public class OrderService
{
    private final OrderRepository orderRepository;
    private final ProfileService profileService;
    private final ShoppingCartService shoppingCartService;

    public OrderService(OrderRepository orderRepository, ProfileService profileService, ShoppingCartService shoppingCartService)
    {
        this.orderRepository = orderRepository;
        this.profileService = profileService;
        this.shoppingCartService = shoppingCartService;
    }

    @Transactional
    public Order create(int userId)
    {
        Profile profile = profileService.getProfile(userId);
        ShoppingCart shoppingCart = shoppingCartService.getByUserId(userId);

        if(shoppingCart.getItems().isEmpty())  throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        Order order = new Order();

        order.setUserId(userId);
        order.setAddress(profile.getAddress());
        order.setCity(profile.getCity());
        order.setZip(profile.getZip());
        order.setState(profile.getState());
        order.setShippingAmount(20.0);
        order.setDate(LocalDateTime.now().toString());

        shoppingCartService.clearCart(userId);

        return orderRepository.save(order);
    }
}
