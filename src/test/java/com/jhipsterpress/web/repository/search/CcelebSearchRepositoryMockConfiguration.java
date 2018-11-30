package com.jhipsterpress.web.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of CcelebSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CcelebSearchRepositoryMockConfiguration {

    @MockBean
    private CcelebSearchRepository mockCcelebSearchRepository;

}
