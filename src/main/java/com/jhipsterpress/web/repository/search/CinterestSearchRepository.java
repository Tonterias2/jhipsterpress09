package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Cinterest;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Cinterest entity.
 */
public interface CinterestSearchRepository extends ElasticsearchRepository<Cinterest, Long> {
}
