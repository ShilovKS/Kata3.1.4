package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.EnumRole;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;

import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    UserService userService;

    @Autowired
    RoleService roleService;


    @PostConstruct
    void init() {
        Arrays.stream(EnumRole.values())
                .map(x -> x.toString())
                .forEach(x -> roleService.addRole(new Role(x)));


        User startUser = new User("admin", "admin", 3,"admin", "admin");
        startUser.addRoleToUser(roleService.findByName("ROLE_ADMIN"));
        userService.addUser(startUser);

    }

    @GetMapping("/new")
    public String newUser(Model model) {
        model.addAttribute("user", new User());
        List<Role> roles = roleService.getAllRoles();
        model.addAttribute("allRoles", roles);
        return "adminViews/addUser";
    }

    @PostMapping()
    public String createUser(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/{id}/edit")
    public String editUser(Model model, @PathVariable("id") Long id) {
        model.addAttribute("editUser", userService.getUser(id));
        List<Role> roles = roleService.getAllRoles();
        model.addAttribute("allRoles", roles);
        return "adminViews/editUser";
    }

    @PutMapping()
    public String update(@ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/")
    public String deleteUser(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    @GetMapping()
    public String showAllUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "adminViews/showAllUsers";
    }

    @GetMapping("/{id}")
    public String showOneUsers(Model model, @PathVariable("id") Long id)  {
        model.addAttribute("user", userService.getUser(id));
        return "userViews/oneUser";
    }


}
