package com.hassediagrams.rejzo.controller;

import com.hassediagrams.rejzo.dto.DiagramData;
import com.hassediagrams.rejzo.dto.ElementDataWrapper;
import com.hassediagrams.rejzo.service.DiagramService;
import com.hassediagrams.rejzo.util.DiagramJSONGenerator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diagrams")
public class DiagramController {

    private final DiagramService diagramService;

    // Just for testing for now
    private DiagramData diagram;

    public DiagramController(DiagramService diagramService) {
        this.diagramService = diagramService;
    }

    /**
     * Creates the diagram
     * TODO: inserts it into the table
     *
     * @param data input from user
     * @return returns status
     */
    @PostMapping("/create")
    public ResponseEntity<String> createDiagram(@RequestBody ElementDataWrapper data) {
        this.diagram = diagramService.createDiagram(data);

        return ResponseEntity.ok("API Called, Result: ");
    }

    /**
     * Fetches all diagrams from database
     * TODO: database - for now just attributes
     *
     * @return returns diagram json data
     */
    @GetMapping("fetchAll")
    public ResponseEntity<String> fetchDiagrams() {
        String json = DiagramJSONGenerator.generateDiagramJson(diagram);

        return ResponseEntity.ok(json);
    }
}
