package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Vthumb;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Vthumb entity.
 */
public interface VthumbSearchRepository extends ElasticsearchRepository<Vthumb, Long> {
}
