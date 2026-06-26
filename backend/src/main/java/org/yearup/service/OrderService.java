package org.yearup.service;

import org.springframework.stereotype.Service;
import org.yearup.models.Order;
import org.yearup.models.Profile;
import org.yearup.repository.OrderRepository;

import java.time.LocalDateTime;

@Service
public class OrderService
{
    private final OrderRepository orderRepository;
    private final ProfileService profileService;

    public OrderService(OrderRepository orderRepository, ProfileService profileService)
    {
        this.orderRepository = orderRepository;
        this.profileService = profileService;
    }

    public Order create(int userId)
    {
        Profile profile = profileService.getProfile(userId);

        Order order = new Order();

        order.setUserId(userId);
        order.setAddress(profile.getAddress());
        order.setCity(profile.getCity());
        order.setZip(profile.getZip());
        order.setState(profile.getState());
        order.setShippingAmount(20.0);
        order.setDate(LocalDateTime.now().toString());

        return orderRepository.save(order);
    }
}
