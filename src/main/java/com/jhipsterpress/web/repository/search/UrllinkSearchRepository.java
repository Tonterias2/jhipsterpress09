package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Urllink;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Urllink entity.
 */
public interface UrllinkSearchRepository extends ElasticsearchRepository<Urllink, Long> {
}
