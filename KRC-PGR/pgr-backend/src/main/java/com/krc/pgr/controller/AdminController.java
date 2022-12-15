package com.krc.pgr.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import com.krc.pgr.aspect.Permit;
import com.krc.pgr.constant.Authority;

@RestController
@RequestMapping("/admin")
@Permit(authority = { Authority.ADMIN })
public class AdminController {

}
