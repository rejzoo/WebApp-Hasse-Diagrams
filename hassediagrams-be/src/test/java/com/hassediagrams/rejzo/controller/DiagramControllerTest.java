package com.hassediagrams.rejzo.controller;

import com.hassediagrams.rejzo.dto.*;
import com.hassediagrams.rejzo.model.Diagram;
import com.hassediagrams.rejzo.service.DiagramService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = DiagramController.class)
@Import(ControllerTestConfig.class)
public class DiagramControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DiagramService diagramService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testFetchDiagrams() throws Exception {
        Diagram diagram = mock(Diagram.class);
        when(diagramService.findAll()).thenReturn(Arrays.asList(diagram));

        mockMvc.perform(get("/api/diagrams/fetchAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists());
    }

    @Test
    public void testFetchDiagram() throws Exception {
        Diagram diagram = mock(Diagram.class);
        Integer id = 1;

        when(diagramService.findDiagram(id)).thenReturn(Optional.of(diagram));

        mockMvc.perform(get("/api/diagrams/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());

        verify(diagramService).findDiagram(id);
    }

    @Test
    public void testFetchCriticalElements() throws Exception {
        Map<String, List<List<String>>> critElements = new HashMap<>();
        critElements.put("key", Collections.singletonList(Arrays.asList("elem1", "elem2")));
        when(diagramService.findCriticalElements(1)).thenReturn(critElements);

        mockMvc.perform(get("/api/diagrams/critElements/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.key").exists());
    }

    @Test
    public void testCreateDiagram() throws Exception {
        String jsonRequest = "{\"elements\": []}";
        when(diagramService.saveDiagram(any(ElementDataWrapper.class))).thenReturn(true);

        mockMvc.perform(post("/api/diagrams/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(content().string("Diagram created and saved."));
    }

    @Test
    public void testUpdateFunctionality() throws Exception {
        DiagramDataDTO dataDTO = new DiagramDataDTO(new ArrayList<NodeDTO>(), new ArrayList<EdgeDTO>());
        when(diagramService.updateDiagramFunctionality(eq(1), any(DiagramDataDTO.class))).thenReturn(true);

        String jsonRequest = objectMapper.writeValueAsString(dataDTO);

        mockMvc.perform(post("/api/diagrams/update/func/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(content().string("Diagram updated."));
    }

    @Test
    public void testUpdateInformation() throws Exception {
        DiagramInfoUpdateDTO infoDTO = new DiagramInfoUpdateDTO();
        when(diagramService.updateDiagramInformation(eq(1), any(DiagramInfoUpdateDTO.class))).thenReturn(true);

        String jsonRequest = objectMapper.writeValueAsString(infoDTO);

        mockMvc.perform(post("/api/diagrams/update/info/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(content().string("Diagram updated."));
    }
}
