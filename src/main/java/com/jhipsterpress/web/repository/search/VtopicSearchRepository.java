package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Vtopic;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Vtopic entity.
 */
public interface VtopicSearchRepository extends ElasticsearchRepository<Vtopic, Long> {
}
