package com.jhipsterpress.web.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of CalbumSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class CalbumSearchRepositoryMockConfiguration {

    @MockBean
    private CalbumSearchRepository mockCalbumSearchRepository;

}
