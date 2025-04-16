package com.hassediagrams.rejzo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hassediagrams.rejzo.dto.DiagramDataDTO;
import com.hassediagrams.rejzo.dto.DiagramInfoUpdateDTO;
import com.hassediagrams.rejzo.dto.ElementDataDTO;
import com.hassediagrams.rejzo.dto.ElementDataWrapper;
import com.hassediagrams.rejzo.model.Diagram;
import com.hassediagrams.rejzo.repository.DiagramRepository;
import com.hassediagrams.rejzo.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsSource;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.*;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DiagramServiceTest {
    private DiagramRepository diagramRepository;
    private ObjectMapper objectMapper;
    private GraphService graphService;
    private DiagramService diagramService;

    @BeforeEach
    void setUp() {
        diagramRepository = mock(DiagramRepository.class);
        objectMapper = new ObjectMapper();
        graphService = mock(GraphService.class);
        diagramService = new DiagramService(diagramRepository, objectMapper, graphService);
    }

    @Test
    public void testFindAll() {
        Iterable<Diagram> list = Collections::emptyIterator;
        when(diagramRepository.findAll()).thenReturn(list);

        assertEquals(list, diagramService.findAll());

        verify(diagramRepository).findAll();
    }

    @Test
    public void testFindDiagram() {
        Integer id = 1;
        Optional<Diagram> diagram = Optional.empty();

        when(diagramRepository.findById(id)).thenReturn(diagram);

        assertEquals(Optional.empty(), diagramService.findDiagram(id));

        verify(diagramRepository).findById(id);
    }

    @Test
    public void testFindDiagramNull() {
        Integer id = 1;
        Optional<Diagram> diagram = Optional.of(mock(Diagram.class));

        when(diagramRepository.findById(id)).thenReturn(diagram);

        assertEquals(diagram, diagramService.findDiagram(id));

        verify(diagramRepository).findById(id);
    }

    @Test
    public void testFindCriticalElementsNotEmpty() {
        Integer id = 1;
        String json = "{\"1\": [[\"0\", \"1\"]], \"2\": [[\"0\", \"1\"]]}";
        when(diagramRepository.findCriticalStates(1)).thenReturn(json);

        Map<String, List<List<String>>> result = diagramService.findCriticalElements(id);

        assertNotNull(result);
        assertTrue(result.containsKey("1"));
        assertTrue(result.containsKey("2"));
        verify(diagramRepository).findCriticalStates(id);
    }

    @Test
    public void testFindCriticalElementsEmpty() {
        Integer id = 1;
        when(diagramRepository.findCriticalStates(1)).thenReturn(null);

        Map<String, List<List<String>>> result = diagramService.findCriticalElements(id);

        assertInstanceOf(HashMap.class, result);
        assertTrue(result.isEmpty());
        verify(diagramRepository).findCriticalStates(id);
    }

    @Test
    public void testSaveDiagramSuccess() {
        ElementDataWrapper wrapper = TestDataFactory.createValidWrapper();
        Integer diagramId = 1;

        Diagram savedDiagram = new Diagram(1, wrapper.getDiagramName(), wrapper.getNumberOfElements(),
                wrapper.getVisibility(), TestDataFactory.createDiagramData());
        savedDiagram.setDiagram_id(diagramId);

        when(diagramRepository.save(any(Diagram.class))).thenReturn(savedDiagram);

        boolean result = diagramService.saveDiagram(wrapper);

        assertTrue(result);
        verify(diagramRepository).save(any(Diagram.class));
        verify(graphService).processCriticalStates(diagramId,
                savedDiagram.getDiagram_data());
    }

    @Test
    public void testSaveDiagramNonSuccess() {
        ElementDataWrapper wrapper = TestDataFactory.createValidWrapper();
        Integer diagramId = 1;

        Diagram savedDiagram = new Diagram(1, wrapper.getDiagramName(), wrapper.getNumberOfElements(),
                wrapper.getVisibility(), TestDataFactory.createDiagramData());

        when(diagramRepository.save(any(Diagram.class))).thenReturn(savedDiagram);

        boolean result = diagramService.saveDiagram(wrapper);

        assertFalse(result);
        verify(diagramRepository).save(any(Diagram.class));
    }

    @Test
    public void testUpdateDiagramFunctionalitySuccess() {
        Integer id = 1;
        DiagramDataDTO dataDTO = TestDataFactory.createDiagramData();

        when(diagramRepository.updateDiagramStructure(eq(id), anyString())).thenReturn(1);

        boolean updated = diagramService.updateDiagramFunctionality(id, dataDTO);

        assertTrue(updated);
        verify(diagramRepository).updateDiagramStructure(eq(id), anyString());
        verify(diagramRepository).clearCriticalStates(id);
        verify(graphService).processCriticalStates(id, dataDTO);
    }

    @Test
    public void testUpdateDiagramFunctionalityNonSuccess() {
        Integer id = 1;
        DiagramDataDTO dataDTO = TestDataFactory.createDiagramData();

        when(diagramRepository.updateDiagramStructure(eq(id), anyString())).thenReturn(0);

        boolean updated = diagramService.updateDiagramFunctionality(id, dataDTO);

        assertFalse(updated);
        verify(diagramRepository).updateDiagramStructure(eq(id), anyString());
    }

    private static Stream<Arguments> provideBothStates() {
        return Stream.of(
                Arguments.of(0, false),
                Arguments.of(1, true)
        );
    }

    @ParameterizedTest
    @MethodSource("provideBothStates")
    public void testUpdateDiagramInformation(int resultRows, boolean resultMethod) {
        Integer id = 1;
        DiagramInfoUpdateDTO updateData = new DiagramInfoUpdateDTO();
        String name = "name";
        String visibility = "public";
        updateData.setDiagram_name(name);
        updateData.setVisibility(visibility);

        when(diagramRepository.updateDiagramInformation(id, name, visibility)).thenReturn(resultRows);

        assertEquals(resultMethod, diagramService.updateDiagramInformation(id, updateData));

        verify(diagramRepository).updateDiagramInformation(id, name, visibility);
    }
}
