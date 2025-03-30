package com.hassediagrams.rejzo.model;

import com.hassediagrams.rejzo.dto.DiagramDataDTO;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import java.util.List;
import java.util.Map;

/**
 * Table entity
 */
@Entity
@Table(name = "diagrams")
@Getter
@Setter
public class Diagram {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer diagram_id;

    private Integer user_id;
    private String diagram_name;
    private Integer diagram_elements_count;
    private String visibility;

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "diagram_structure", columnDefinition = "jsonb")
    private DiagramDataDTO diagram_data;

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "critical_states", columnDefinition = "jsonb")
    private Map<String, List<List<String>>> criticalStates;

    private Diagram() {}

    public Diagram(Integer user_id, String diagram_name, Integer diagram_elements_count, String visibility, DiagramDataDTO diagram_data) {
        this.user_id = user_id;
        this.diagram_name = diagram_name;
        this.diagram_elements_count = diagram_elements_count;
        this.visibility = visibility;
        this.diagram_data = diagram_data;
    }
}
