package com.hassediagrams.rejzo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hassediagrams.rejzo.dto.DiagramDataDTO;
import com.hassediagrams.rejzo.dto.EdgeDTO;
import com.hassediagrams.rejzo.dto.NodeDTO;
import com.hassediagrams.rejzo.repository.DiagramRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class GraphServiceTest {
    private DiagramRepository diagramRepository;
    private GraphService graphService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        diagramRepository = mock(DiagramRepository.class);
        objectMapper = new ObjectMapper();
        doNothing().when(diagramRepository).updateCriticalStates(anyInt(), eq(""));
        graphService = new GraphService(diagramRepository, objectMapper);
    }

    @Test
    void testProcessCriticalStates() throws Exception {
        NodeDTO nodeA = new NodeDTO("A", Arrays.asList(1, 1), 1);
        NodeDTO nodeB = new NodeDTO("B", Arrays.asList(1, 0), 1);
        NodeDTO nodeC = new NodeDTO("C", Arrays.asList(0, 0), 0);

        List<NodeDTO> nodes = new ArrayList<>();
        nodes.add(nodeB);
        nodes.add(nodeA);
        nodes.add(nodeC);

        List<EdgeDTO> edges = new ArrayList<>();

        DiagramDataDTO diagramDataDTO = new DiagramDataDTO(nodes, edges);

        int id = 1;
        graphService.processCriticalStates(id, diagramDataDTO);

        Map<Integer, List<List<Integer>>> expectedCriticalNodes = new HashMap<>();
        expectedCriticalNodes.put(1, Collections.singletonList(Arrays.asList(1, 1)));
        expectedCriticalNodes.put(2, Collections.singletonList(Arrays.asList(1, 0)));

        String expectedJson = objectMapper.writeValueAsString(expectedCriticalNodes);

        verify(diagramRepository, times(1)).updateCriticalStates(eq(id), eq(expectedJson));
    }
}
