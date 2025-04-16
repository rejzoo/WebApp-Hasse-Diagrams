package com.hassediagrams.rejzo.dto;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class NodeDTOTest {
    @Test
    void testGetLevelWithNoZeros() {
        NodeDTO node = new NodeDTO("node1", Arrays.asList(1, 1, 1), 0);
        assertEquals(1, node.getLevel());
    }

    @Test
    void testGetLevelWithOneZero() {
        NodeDTO node = new NodeDTO("node2", Arrays.asList(0, 1, 1), 0);
        assertEquals(2, node.getLevel());
    }

    @Test
    void testGetLevelWithMultipleZeros() {
        NodeDTO node = new NodeDTO("node3", Arrays.asList(0, 0, 0), 0);
        assertEquals(4, node.getLevel());
    }

    @Test
    void testGetLevelWithEmptyList() {
        NodeDTO node = new NodeDTO("node4", Collections.emptyList(), 0);
        assertEquals(1, node.getLevel());
    }
}
