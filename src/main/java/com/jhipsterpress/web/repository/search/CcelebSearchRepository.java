package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Cceleb;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Cceleb entity.
 */
public interface CcelebSearchRepository extends ElasticsearchRepository<Cceleb, Long> {
}
