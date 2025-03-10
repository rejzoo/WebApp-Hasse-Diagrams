package com.hassediagrams.rejzo.model;

import com.hassediagrams.rejzo.dto.DiagramData;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

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

    @Type(JsonBinaryType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "diagram", columnDefinition = "jsonb")
    private DiagramData diagram_data;

    private Diagram() {}

    public Diagram(Integer user_id, String diagram_name, DiagramData diagram_data) {
        this.user_id = user_id;
        this.diagram_name = diagram_name;
        this.diagram_data = diagram_data;
    }
}
