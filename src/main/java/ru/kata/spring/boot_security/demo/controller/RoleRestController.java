package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.service.RoleService;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleRestController {

    @Autowired
    RoleService roleService;

    @GetMapping()
    public List<Role> showAllUsers() {
        return roleService.getAllRoles();
    }

    @GetMapping("{name}")
    public Role getSingleUsers(@PathVariable String name) {
        return roleService.findByName(name);
    }
}
