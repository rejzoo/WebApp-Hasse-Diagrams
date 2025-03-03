package com.hassediagrams.rejzo.service;

import com.hassediagrams.rejzo.dto.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DiagramService {

    public DiagramService() {}

    /**
     * Create list of nodes and edges
     *
     * @param data that contains user input about diagram
     * @return TODO: NOT IMPLEMENTED YET
     */
    public DiagramData createDiagram(ElementDataWrapper data) {
        int numberOfElements = data.getNumberOfElements();
        int numberOfRows = (int) Math.pow(2, numberOfElements);

        List<NodeDTO> nodes = constructNodes(numberOfRows, data);
        List<EdgeDTO> edges = constructEdges(nodes);

        return new DiagramData(nodes, edges);
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
     * @param data wrapper containing data for each row and number of elements
     * @return list of nodes
     */
    private List<NodeDTO> constructNodes(int numberOfRows, ElementDataWrapper data) {
        List<NodeDTO> nodes = new ArrayList<>();

        for (int i = 0; i < numberOfRows; i++) {
            ElementData elementData = data.getElementData().get(i);
            String id = constructId(elementData.getElements());
            List<Integer> elements = elementData.getElements();
            int functionality = elementData.getSystem();

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
                    edges.add(new EdgeDTO(nodeA.getId(), nodeB.getId()));
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
}
