package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Calbum;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Calbum entity.
 */
public interface CalbumSearchRepository extends ElasticsearchRepository<Calbum, Long> {
}
