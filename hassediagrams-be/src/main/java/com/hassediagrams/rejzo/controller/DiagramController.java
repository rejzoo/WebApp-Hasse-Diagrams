package com.hassediagrams.rejzo.controller;

import com.hassediagrams.rejzo.dto.DiagramData;
import com.hassediagrams.rejzo.dto.ElementDataWrapper;
import com.hassediagrams.rejzo.service.DiagramService;
import com.hassediagrams.rejzo.util.DiagramJSONGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diagrams")
public class DiagramController {

    private final DiagramService diagramService;

    public DiagramController(DiagramService diagramService) {
        this.diagramService = diagramService;
    }

    /**
     * Fetches all diagrams from database
     * TODO: database - for now just attributes
     *
     * @return returns diagrams values for preview
     */
    @GetMapping("/fetchAll")
    public ResponseEntity<String> fetchDiagrams() {
        String json = diagramService.findAll();

        return ResponseEntity.ok(json);
    }

    /**
     * Fetches diagram from database
     * TODO: database - for now just attributes
     *
     * @return returns diagram json data
     */
    @GetMapping("/{id}")
    public ResponseEntity<String> fetchDiagram(@PathVariable String id) {
        String json = String.valueOf(diagramService.findDiagram(Integer.valueOf(id)));

        return ResponseEntity.ok(json);
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
        diagramService.saveDiagram(data);

        return ResponseEntity.ok("API Called");
    }
}
