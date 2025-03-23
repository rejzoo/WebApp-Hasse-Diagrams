package com.hassediagrams.rejzo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hassediagrams.rejzo.dto.DiagramData;
import com.hassediagrams.rejzo.dto.EdgeDTO;
import com.hassediagrams.rejzo.dto.NodeDTO;
import com.hassediagrams.rejzo.repository.DiagramRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GraphService {
    private final DiagramRepository diagramRepository;
    private final ObjectMapper objectMapper;

    public GraphService(DiagramRepository diagramRepository, ObjectMapper objectMapper) {
        this.diagramRepository = diagramRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Asynchronous master method for processing critical elements
     *
     * @param diagramId of diagram to calculate on
     * @param diagramData of diagram to calculate on
     */
    @Async
    @Transactional
    public void processCriticalElements(Integer diagramId, DiagramData diagramData) {
        System.out.println("ASYNC STARTED");

        List<NodeDTO> nodes = diagramData.getNodes().stream()
                .sorted(Comparator.comparingInt(NodeDTO::getLevel))
                .toList();
        List<EdgeDTO> edges = diagramData.getEdges().reversed();

        Map<String, List<List<String>>> criticalNodes = findCriticalElements(nodes, edges);

        int updatedRows = 0;
        try {
            String json = objectMapper.writeValueAsString(criticalNodes);
            updatedRows = diagramRepository.updateCriticalElements(diagramId, json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting DiagramData to JSON", e);
        }

        System.out.println("ASYNC ENDED, UPDATED: " + updatedRows);
    }

    /**
     * Finds all the critical elements and groups them by level in the hashmap
     *
     * @param nodes of the diagram
     * @param edges of the diagram
     * @return HashMap of all critical elements grouped by level
     */
    private Map<String, List<List<String>>> findCriticalElements(List<NodeDTO> nodes, List<EdgeDTO> edges) {
        Map<String, List<List<String>>> criticalNodes = new HashMap<>();
        int levels = nodes.getLast().getLevel();

        Map<String, NodeDTO> nodeMap = nodes.stream().collect(Collectors.toMap(NodeDTO::getId, node -> node));

        int actualLevel = 0;

        for (NodeDTO node : nodes) {
            if (node.getLevel() == levels) {
                // END
                break;
            }

            if (node.getLevel() - 1 == actualLevel) {
                actualLevel = node.getLevel();
                criticalNodes.put("level" + actualLevel, new ArrayList<>());
            }

            if (node.getFunctionality() == 0) {
                continue;
            }

            boolean isValid = true;

            for (EdgeDTO edge : edges) {
                if (Objects.equals(node.getId(), edge.getFrom())) {
                    NodeDTO nodeTo = nodeMap.get(edge.getTo());
                    if (nodeTo.getFunctionality() == 1) {
                        isValid = false;
                        break;
                    }
                }
            }

            if (isValid) {
                criticalNodes.get("level" + actualLevel).add(node.getFunctionalElements());
            }
        }

        return sortCriticalNodes(criticalNodes);
    }

    /**
     * Sorts lists in ascending order
     *
     * @param criticalNodes map to sort
     * @return sorted values in the map
     */
    private Map<String, List<List<String>>> sortCriticalNodes(Map<String, List<List<String>>> criticalNodes) {
        for (Map.Entry<String, List<List<String>>> entry : criticalNodes.entrySet()) {
            List<List<String>> listOfLists = entry.getValue();
            listOfLists.sort((list1, list2) -> {
                int minSize = Math.min(list1.size(), list2.size());
                for (int i = 0; i < minSize; i++) {
                    int num1 = Integer.parseInt(list1.get(i).substring(1));
                    int num2 = Integer.parseInt(list2.get(i).substring(1));
                    if (num1 != num2) {
                        return Integer.compare(num1, num2);
                    }
                }
                return Integer.compare(list1.size(), list2.size());
            });
        }

        return criticalNodes;
    }
}
