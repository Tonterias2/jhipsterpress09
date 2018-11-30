package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Vanswer;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Vanswer entity.
 */
public interface VanswerSearchRepository extends ElasticsearchRepository<Vanswer, Long> {
}
