package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Frontpageconfig;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Frontpageconfig entity.
 */
public interface FrontpageconfigSearchRepository extends ElasticsearchRepository<Frontpageconfig, Long> {
}
