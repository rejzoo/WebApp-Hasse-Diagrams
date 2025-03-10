package com.hassediagrams.rejzo.controller;

import com.hassediagrams.rejzo.dto.ElementDataWrapper;
import com.hassediagrams.rejzo.model.Diagram;
import com.hassediagrams.rejzo.service.DiagramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/diagrams")
public class DiagramController {

    private final DiagramService diagramService;

    public DiagramController(DiagramService diagramService) {
        this.diagramService = diagramService;
    }

    /**
     * Fetches all diagrams from database
     *
     * @return returns diagrams values for preview
     */
    @GetMapping("/fetchAll")
    public ResponseEntity<List<Diagram>> fetchDiagrams() {
        Iterable<Diagram> iterable = diagramService.findAll();
        List<Diagram> diagrams = StreamSupport.stream(iterable.spliterator(), false)
                .collect(Collectors.toList());

        return ResponseEntity.ok(diagrams);
    }

    /**
     * Fetches diagram from database
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
