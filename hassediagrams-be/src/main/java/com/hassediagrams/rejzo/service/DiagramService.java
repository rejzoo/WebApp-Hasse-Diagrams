package com.hassediagrams.rejzo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hassediagrams.rejzo.dto.*;
import com.hassediagrams.rejzo.model.Diagram;
import com.hassediagrams.rejzo.repository.DiagramRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DiagramService {
    private final DiagramRepository diagramRepository;
    private final ObjectMapper objectMapper;
    private final GraphService graphService;

    public DiagramService(DiagramRepository diagramRepository, ObjectMapper objectMapper, GraphService graphService) {
        this.diagramRepository = diagramRepository;
        this.objectMapper = objectMapper;
        this.graphService = graphService;
    }

    /**
     * Returns all diagrams from db
     *
     * @return diagrams
     */
    public Iterable<Diagram> findAll() {
        return diagramRepository.findAll();
    }

    /**
     * Finds diagram by id
     *
     * @param id of the diagram
     * @return diagram with param id
     */
    public Optional<Diagram> findDiagram(Integer id) { return diagramRepository.findById(id); }

    /**
     * Finds critical elements
     *
     * @param id of the diagram
     * @return critical elements
     */
    public Map<String, List<List<String>>> findCriticalElements(Integer id) {
        String json = diagramRepository.findCriticalStates(id);

        if (json == null || json.trim().isEmpty()) {
            return new HashMap<>();
        }

        try {
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing critical elements", e);
        }
    }

    /**
     * Saves the created diagram into the database
     *
     * @param data for diagram creation
     * @return boolean value, if is not null diagram was saved
     */
    public boolean saveDiagram(ElementDataWrapper data) {
        Diagram diagramToSave = createDiagram(data);

        Diagram savedDiagram = diagramRepository.save(diagramToSave);
        boolean saved = savedDiagram.getDiagram_id() != null;

        if (saved) {
            graphService.processCriticalStates(savedDiagram.getDiagram_id(), savedDiagram.getDiagram_data());
        }

        return saved;
    }

    /**
     * Deletes diagram from database
     *
     * @param id of the diagram
     * @return boolean value
     */
    public boolean deleteDiagram(Integer id) {
        if (!diagramRepository.existsById(id)) {
            return false;
        }

        diagramRepository.deleteById(id);
        return true;
    }

    /**
     * Updates diagram with corresponding id
     *
     * @param id   for diagram to update
     * @param data which will be updated
     * @return returns number of updated rows
     */
    @Transactional
    public boolean updateDiagramFunctionality(Integer id, DiagramDataDTO data) {
        try {
            String jsonStructure = objectMapper.writeValueAsString(data);
            boolean updated = 1 == diagramRepository.updateDiagramStructure(id, jsonStructure);

            if (updated) {
                diagramRepository.clearCriticalStates(id);
                graphService.processCriticalStates(id, data);
            }

            return updated;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting DiagramData to JSON", e);
        }
    }

    /**
     * Updates diagram information with corresponding id
     *
     * @param id   for diagram to update
     * @param data which will be updated
     * @return returns number of updated rows
     */
    @Transactional
    public boolean updateDiagramInformation(Integer id, DiagramInfoUpdateDTO data) {
        return 1 == diagramRepository.updateDiagramInformation(id, data.getDiagram_name(), data.getVisibility());
    }

    /**
     * Create list of nodes and edges
     *
     * @param data that contains user input about diagram
     * @return Diagram returns constructed diagram
     */
    private Diagram createDiagram(ElementDataWrapper data) {
        return new Diagram(1, data.getDiagramName(), data.getNumberOfElements(),
                data.getVisibility(), constructDiagramData(data));
    }

    /**
     * Creates string id of the node
     * Values together are unique because of the binary combinations
     *
     * @param elements boolean functionality of the elements
     * @return unique id
     */
    private String constructId(List<Integer> elements) {
        StringBuilder sb = new StringBuilder();

        for (Integer value : elements) {
            sb.append(value);
        }

        return sb.toString();
    }

    /**
     * Creates list of all nodes in the diagram
     *
     * @param numberOfRows self-describing
     * @param data         wrapper containing data for each row and number of elements
     * @return list of nodes
     */
    private List<NodeDTO> constructNodes(int numberOfRows, ElementDataWrapper data) {
        List<NodeDTO> nodes = new ArrayList<>();

        for (int i = 0; i < numberOfRows; i++) {
            ElementDataDTO elementDataDTO = data.getElementDataDTOS().get(i);
            String id = constructId(elementDataDTO.getElements());
            List<Integer> elements = elementDataDTO.getElements();
            int functionality = elementDataDTO.getSystem();

            nodes.add(new NodeDTO(id, elements, functionality));
        }

        return nodes;
    }

    /**
     * Creates list of all edges
     *
     * @param nodes list of all nodes in the diagram
     * @return list of edges
     */
    private List<EdgeDTO> constructEdges(List<NodeDTO> nodes) {
        List<EdgeDTO> edges = new ArrayList<>();

        for (int i = 0; i < nodes.size(); i++) {
            NodeDTO nodeA = nodes.get(i);

            for (int j = 0; j < nodes.size(); j++) {
                if (i == j)
                    continue;

                NodeDTO nodeB = nodes.get(j);
                if (edgeExists(nodeA.getElements(), nodeB.getElements())) {
                    edges.add(new EdgeDTO(nodeB.getId(), nodeA.getId()));
                }
            }
        }

        return edges;
    }

    /**
     * Checks if there is edge in between 2 nodes
     *
     * @param nodeAElements elements of the first node to check
     * @param nodeBElements elements of the second node to check
     * @return true or false depending if edge exists
     */
    private boolean edgeExists(List<Integer> nodeAElements, List<Integer> nodeBElements) {
        int levelDifference = 0;

        for (int i = 0; i < nodeAElements.size(); i++) {
            int valueA = nodeAElements.get(i);
            int valueB = nodeBElements.get(i);

            if (valueA > valueB) {
                return false;
            }

            if (valueA == 0 && valueB == 1)
                levelDifference++;
        }

        return levelDifference == 1;
    }

    /**
     * Helper function to construct DiagramData
     *
     * @param data needed to construct DiagramData
     * @return created instance of DiagramData
     */
    private DiagramDataDTO constructDiagramData(ElementDataWrapper data) {
        int numberOfElements = data.getNumberOfElements();
        int numberOfRows = (int) Math.pow(2, numberOfElements);

        List<NodeDTO> nodes = constructNodes(numberOfRows, data);
        List<EdgeDTO> edges = constructEdges(nodes);

        return new DiagramDataDTO(nodes, edges);
    }
}
