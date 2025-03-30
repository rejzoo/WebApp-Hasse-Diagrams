package com.hassediagrams.rejzo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hassediagrams.rejzo.dto.DiagramDataDTO;
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
     * Asynchronous master method for processing critical states
     *
     * @param diagramId of diagram to calculate on
     * @param diagramDataDTO of diagram to calculate on
     */
    @Async
    @Transactional
    public void processCriticalStates(Integer diagramId, DiagramDataDTO diagramDataDTO) {
        double start = (double) System.currentTimeMillis() / 1000;

        List<NodeDTO> nodes = diagramDataDTO.getNodes().stream()
                .sorted(Comparator.comparingInt(NodeDTO::getLevel))
                .toList();
        List<EdgeDTO> edges = diagramDataDTO.getEdges();
        Collections.reverse(edges);

        Map<Integer, List<List<Integer>>> criticalNodes = findCriticalStates(nodes, edges);

        try {
            String json = objectMapper.writeValueAsString(criticalNodes);
            diagramRepository.updateCriticalStates(diagramId, json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting DiagramData to JSON", e);
        }

        double elapsed = ((double) System.currentTimeMillis() / 1000 - start);
        System.out.println("Duration of async method: " + String.format(Locale.US,"%.4f", elapsed) + "\n");
    }

    /**
     * Finds all the critical states and groups them by level in the hashmap
     *
     * @param nodes of the diagram
     * @param edges of the diagram
     * @return HashMap of all critical states grouped by level
     */
    private Map<Integer, List<List<Integer>>> findCriticalStates(List<NodeDTO> nodes, List<EdgeDTO> edges) {
        Map<Integer, List<List<Integer>>> criticalNodes = new HashMap<>();
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
                criticalNodes.put(actualLevel, new ArrayList<>());
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
                criticalNodes.get(actualLevel).add(node.getElements());
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
    private Map<Integer, List<List<Integer>>> sortCriticalNodes(Map<Integer, List<List<Integer>>> criticalNodes) {
        // This method might be useless in this implementation

        for (Map.Entry<Integer, List<List<Integer>>> entry : criticalNodes.entrySet()) {
            List<List<Integer>> listOfLists = entry.getValue();
            listOfLists.sort((list1, list2) -> {
                int minSize = Math.min(list1.size(), list2.size());
                for (int i = 0; i < minSize; i++) {
                    int num1 = list1.get(i);
                    int num2 = list2.get(i);
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
