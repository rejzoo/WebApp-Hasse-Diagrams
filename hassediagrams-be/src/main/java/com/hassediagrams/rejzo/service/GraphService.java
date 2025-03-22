package com.hassediagrams.rejzo.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hassediagrams.rejzo.dto.DiagramData;
import com.hassediagrams.rejzo.repository.DiagramRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GraphService {
    private final DiagramRepository diagramRepository;
    private final ObjectMapper objectMapper;

    public GraphService(DiagramRepository diagramRepository, ObjectMapper objectMapper) {
        this.diagramRepository = diagramRepository;
        this.objectMapper = objectMapper;
    }

    @Async
    @Transactional
    public void processCriticalElements(Integer diagramId, DiagramData diagramData) {
        System.out.println("YAY ASYNC METHOD");

        int updatedRows = 0;
        try {
            String json = objectMapper.writeValueAsString(Collections.emptyMap());
            updatedRows = diagramRepository.updateCriticalElements(diagramId, json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting DiagramData to JSON", e);
        }

        System.out.println("ASYNC UPDATED: " + updatedRows);
    }
}
