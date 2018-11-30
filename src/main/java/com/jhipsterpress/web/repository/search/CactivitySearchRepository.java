package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Cactivity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Cactivity entity.
 */
public interface CactivitySearchRepository extends ElasticsearchRepository<Cactivity, Long> {
}
