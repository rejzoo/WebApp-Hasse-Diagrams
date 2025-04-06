package com.hassediagrams.rejzo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hassediagrams.rejzo.service.DiagramService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.mockito.Mockito;

@TestConfiguration
public class ControllerTestConfig {

    @Bean
    public DiagramService diagramService() {
        return Mockito.mock(DiagramService.class);
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
