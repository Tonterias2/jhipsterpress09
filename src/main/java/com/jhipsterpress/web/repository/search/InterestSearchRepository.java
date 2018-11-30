package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Interest;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Interest entity.
 */
public interface InterestSearchRepository extends ElasticsearchRepository<Interest, Long> {
}
