package com.hassediagrams.rejzo.repository;

import com.hassediagrams.rejzo.dto.DiagramData;
import com.hassediagrams.rejzo.model.Diagram;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface DiagramRepository extends CrudRepository<Diagram, Integer> {

    @Modifying
    @Transactional
    @Query(value = "UPDATE diagrams SET diagram = cast(:newDiagram as jsonb) WHERE diagram_id = :id", nativeQuery = true)
    int updateDiagram(@Param("id") Integer id, @Param("newDiagram") String newDiagram);
}
