package com.hassediagrams.rejzo;

import com.hassediagrams.rejzo.dto.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestDataFactory {

    public static ElementDataWrapper createValidWrapper() {
        Map<String, Object> props = new HashMap<>();
        props.put("elements1", List.of(1, 1));
        props.put("elements2", List.of(1, 0));
        props.put("elements3", List.of(0, 1));
        props.put("elements4", List.of(0, 0));
        props.put("functional1", 1);
        props.put("functional2", 1);
        props.put("functional3", 1);
        props.put("functional4", 0);

        ElementDataDTO dataDTO = new ElementDataDTO(props);
        List<ElementDataDTO> elementDataDTOS = List.of(dataDTO, dataDTO, dataDTO, dataDTO);

        return new ElementDataWrapper("test", 2, "public",
                elementDataDTOS);
    }

    public static DiagramDataDTO createDiagramData() {
        List<NodeDTO> nodes = List.of(new NodeDTO("1", Collections.emptyList(), 0));
        List<EdgeDTO> edges = List.of(new EdgeDTO("11", "10"));

        return new DiagramDataDTO(nodes, edges);
    }
}
