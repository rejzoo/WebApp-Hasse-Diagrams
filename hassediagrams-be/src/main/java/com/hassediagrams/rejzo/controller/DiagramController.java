package com.hassediagrams.rejzo.controller;

import com.hassediagrams.rejzo.dto.ElementData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/diagrams")
public class DiagramController {

    @PostMapping("/create")
    public ResponseEntity<String> createDiagram(@RequestBody List<ElementData> data) {

        System.out.println(data);

        return ResponseEntity.ok("API Call went thru");
    }
}
