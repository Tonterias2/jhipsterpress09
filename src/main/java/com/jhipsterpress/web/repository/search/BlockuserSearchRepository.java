package com.jhipsterpress.web.repository.search;

import com.jhipsterpress.web.domain.Blockuser;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Blockuser entity.
 */
public interface BlockuserSearchRepository extends ElasticsearchRepository<Blockuser, Long> {
}
