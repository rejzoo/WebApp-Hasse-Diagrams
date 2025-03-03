package com.hassediagrams.rejzo.controller;

import com.hassediagrams.rejzo.dto.DiagramData;
import com.hassediagrams.rejzo.dto.ElementDataWrapper;
import com.hassediagrams.rejzo.service.DiagramService;
import com.hassediagrams.rejzo.util.DiagramJSONGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/diagrams")
public class DiagramController {

    private final DiagramService diagramService;

    public DiagramController(DiagramService diagramService) {
        this.diagramService = diagramService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createDiagram(@RequestBody ElementDataWrapper data) {
        DiagramData diagram = diagramService.createDiagram(data);

        String json = DiagramJSONGenerator.generateDiagramJson(diagram);

        return ResponseEntity.ok("API Called, Result: " + json);
    }
}
