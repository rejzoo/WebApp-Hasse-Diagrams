package com.hassediagrams.rejzo.repository;

import com.hassediagrams.rejzo.model.Diagram;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface DiagramRepository extends CrudRepository<Diagram, Integer> {

    @Modifying
    @Transactional
    @Query(value = "UPDATE diagrams SET diagram_structure = cast(:newDiagramStructure as jsonb) WHERE diagram_id = :id", nativeQuery = true)
    int updateDiagramStructure(@Param("id") Integer id, @Param("newDiagramStructure") String newDiagram);

    @Modifying
    @Transactional
    @Query(value = "UPDATE diagrams SET critical_states = cast(:criticalStates as jsonb) WHERE diagram_id = :id", nativeQuery = true)
    void updateCriticalElements(@Param("id") Integer id, @Param("criticalStates") String computedNodes);

    @Query(value = "SELECT critical_states FROM diagrams WHERE diagram_id = :id", nativeQuery = true)
    String findCriticalElements(@Param("id") Integer id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE diagrams SET critical_states = NULL WHERE diagram_id = :id", nativeQuery = true)
    void clearCriticalStates(@Param("id") Integer id);
}
