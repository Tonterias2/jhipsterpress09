package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Cmessage;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Cmessage entity.
 */
public interface CmessageSearchRepository extends ElasticsearchRepository<Cmessage, Long> {
}
