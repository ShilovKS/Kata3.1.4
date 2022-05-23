package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.EnumRole;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    @Autowired
    UserService userService;

    @Autowired
    RoleService roleService;

    @PostConstruct
    void init() {
        Arrays.stream(EnumRole.values())
                .map(x -> x.toString())
                .forEach(x -> roleService.addRole(new Role(x)));

        User startUser = new User("admin_user", "admin_user", 1, "admin_user", "admin_user");
        startUser.addRoleToUser(roleService.findByName("ROLE_ADMIN"));
        startUser.addRoleToUser(roleService.findByName("ROLE_USER"));
        userService.addUser(startUser);

        User startUser2 = new User("user", "user", 2, "user", "user");
        startUser2.addRoleToUser(roleService.findByName("ROLE_USER"));
        userService.addUser(startUser2);

        User startUser3 = new User("admin", "admin", 3, "admin", "admin");
        startUser3.addRoleToUser(roleService.findByName("ROLE_ADMIN"));
        userService.addUser(startUser3);

    }

    @PostMapping()
    public User createUser(@RequestBody User user) {
        userService.addUser(user);
        return user;
    }

    @PutMapping("{id}")
    public User updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return user;
    }

    @DeleteMapping("{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User with Id = " + id + " was deleted";
    }

    @GetMapping()
    public List<User> showAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("{id}")
    public User showOneUsers(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @GetMapping("authentication")
    public User showOneUsers(Authentication authentication) {
        return userService.findByEmail(authentication.getName());
    }

}
