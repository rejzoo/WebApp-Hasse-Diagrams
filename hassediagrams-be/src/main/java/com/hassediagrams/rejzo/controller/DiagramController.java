package com.hassediagrams.rejzo.controller;

import com.hassediagrams.rejzo.dto.DiagramData;
import com.hassediagrams.rejzo.dto.ElementDataWrapper;
import com.hassediagrams.rejzo.model.Diagram;
import com.hassediagrams.rejzo.service.DiagramService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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
     * @param id for wanted diagram
     * @return diagram json data
     */
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Diagram>> fetchDiagram(@PathVariable String id) {
        Optional<Diagram> json = diagramService.findDiagram(Integer.valueOf(id));

        return ResponseEntity.ok(json);
    }

    /**
     * Fetches critical elements for diagram
     *
     * @param id for wanted diagram
     * @return critical elements
     */
    @GetMapping("/critElements/{id}")
    public ResponseEntity<Map<String, List<List<String>>>> fetchCriticalElements(@PathVariable String id) {
        Map<String, List<List<String>>> json = diagramService.findCriticalElements(Integer.valueOf(id));

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
        boolean result = diagramService.saveDiagram(data);

        String resultMessage = result ? "Diagram created and saved." : "Diagram was not saved.";

        if (result) {
            return ResponseEntity.ok(resultMessage);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resultMessage);
        }
    }

    /**
     * Updates functionality for the diagram with id
     *
     * @param id diagram_id to be updated
     * @param data new data
     * @return returns status
     */
    @PostMapping("/update/{id}")
    public ResponseEntity<String> updateFunctionality(@PathVariable String id, @RequestBody DiagramData data) {
        boolean result = diagramService.updateDiagramFunctionality(Integer.valueOf(id), data);

        String resultMessage = result ? "Diagram updated." : "Diagram not updated.";

        if (result) {
            return ResponseEntity.ok(resultMessage);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resultMessage);
        }
    }
}
