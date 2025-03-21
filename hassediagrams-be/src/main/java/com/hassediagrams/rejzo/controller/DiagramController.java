package com.hassediagrams.rejzo.controller;

import com.hassediagrams.rejzo.dto.DiagramData;
import com.hassediagrams.rejzo.dto.ElementDataWrapper;
import com.hassediagrams.rejzo.model.Diagram;
import com.hassediagrams.rejzo.service.DiagramService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
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
    public ResponseEntity<Optional<Diagram>> fetchDiagram(@PathVariable String id) {
        Optional<Diagram> json = diagramService.findDiagram(Integer.valueOf(id));

        return ResponseEntity.ok(json);
    }

    /**
     * Creates the diagram
     *
     * @param data input from user
     * @return returns status
     */
    @PostMapping("/create")
    public ResponseEntity<String> createDiagram(@Valid @RequestBody ElementDataWrapper data) {
        diagramService.saveDiagram(data);

        return ResponseEntity.ok("API Called");
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Boolean> updateFunctionality(@PathVariable String id, @RequestBody DiagramData data) {
        int rowsUpdated = diagramService.updateDiagramFunctionality(Integer.valueOf(id), data);
        boolean result = (rowsUpdated == 1);

        return ResponseEntity.ok(result);
    }
}
