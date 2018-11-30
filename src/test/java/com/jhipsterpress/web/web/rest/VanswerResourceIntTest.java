package com.jhipsterpress.web.web.rest;

import com.jhipsterpress.web.JhipsterpressApp;

import com.jhipsterpress.web.domain.Vanswer;
import com.jhipsterpress.web.domain.Vthumb;
import com.jhipsterpress.web.domain.User;
import com.jhipsterpress.web.domain.Vquestion;
import com.jhipsterpress.web.repository.VanswerRepository;
import com.jhipsterpress.web.repository.search.VanswerSearchRepository;
import com.jhipsterpress.web.service.VanswerService;
import com.jhipsterpress.web.service.dto.VanswerDTO;
import com.jhipsterpress.web.service.mapper.VanswerMapper;
import com.jhipsterpress.web.web.rest.errors.ExceptionTranslator;
import com.jhipsterpress.web.service.dto.VanswerCriteria;
import com.jhipsterpress.web.service.VanswerQueryService;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;


import static com.jhipsterpress.web.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the VanswerResource REST controller.
 *
 * @see VanswerResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = JhipsterpressApp.class)
public class VanswerResourceIntTest {

    private static final Instant DEFAULT_CREATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_URLVANSER = "AAAAAAAAAA";
    private static final String UPDATED_URLVANSER = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ACCEPTED = false;
    private static final Boolean UPDATED_ACCEPTED = true;

    @Autowired
    private VanswerRepository vanswerRepository;

    @Autowired
    private VanswerMapper vanswerMapper;

    @Autowired
    private VanswerService vanswerService;

    /**
     * This repository is mocked in the com.jhipsterpress.web.repository.search test package.
     *
     * @see com.jhipsterpress.web.repository.search.VanswerSearchRepositoryMockConfiguration
     */
    @Autowired
    private VanswerSearchRepository mockVanswerSearchRepository;

    @Autowired
    private VanswerQueryService vanswerQueryService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restVanswerMockMvc;

    private Vanswer vanswer;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final VanswerResource vanswerResource = new VanswerResource(vanswerService, vanswerQueryService);
        this.restVanswerMockMvc = MockMvcBuilders.standaloneSetup(vanswerResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vanswer createEntity(EntityManager em) {
        Vanswer vanswer = new Vanswer()
            .creationDate(DEFAULT_CREATION_DATE)
            .urlvanser(DEFAULT_URLVANSER)
            .accepted(DEFAULT_ACCEPTED);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        vanswer.setUser(user);
        // Add required entity
        Vquestion vquestion = VquestionResourceIntTest.createEntity(em);
        em.persist(vquestion);
        em.flush();
        vanswer.setVquestion(vquestion);
        return vanswer;
    }

    @Before
    public void initTest() {
        vanswer = createEntity(em);
    }

    @Test
    @Transactional
    public void createVanswer() throws Exception {
        int databaseSizeBeforeCreate = vanswerRepository.findAll().size();

        // Create the Vanswer
        VanswerDTO vanswerDTO = vanswerMapper.toDto(vanswer);
        restVanswerMockMvc.perform(post("/api/vanswers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vanswerDTO)))
            .andExpect(status().isCreated());

        // Validate the Vanswer in the database
        List<Vanswer> vanswerList = vanswerRepository.findAll();
        assertThat(vanswerList).hasSize(databaseSizeBeforeCreate + 1);
        Vanswer testVanswer = vanswerList.get(vanswerList.size() - 1);
        assertThat(testVanswer.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testVanswer.getUrlvanser()).isEqualTo(DEFAULT_URLVANSER);
        assertThat(testVanswer.isAccepted()).isEqualTo(DEFAULT_ACCEPTED);

        // Validate the Vanswer in Elasticsearch
        verify(mockVanswerSearchRepository, times(1)).save(testVanswer);
    }

    @Test
    @Transactional
    public void createVanswerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = vanswerRepository.findAll().size();

        // Create the Vanswer with an existing ID
        vanswer.setId(1L);
        VanswerDTO vanswerDTO = vanswerMapper.toDto(vanswer);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVanswerMockMvc.perform(post("/api/vanswers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vanswerDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Vanswer in the database
        List<Vanswer> vanswerList = vanswerRepository.findAll();
        assertThat(vanswerList).hasSize(databaseSizeBeforeCreate);

        // Validate the Vanswer in Elasticsearch
        verify(mockVanswerSearchRepository, times(0)).save(vanswer);
    }

    @Test
    @Transactional
    public void checkCreationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = vanswerRepository.findAll().size();
        // set the field null
        vanswer.setCreationDate(null);

        // Create the Vanswer, which fails.
        VanswerDTO vanswerDTO = vanswerMapper.toDto(vanswer);

        restVanswerMockMvc.perform(post("/api/vanswers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vanswerDTO)))
            .andExpect(status().isBadRequest());

        List<Vanswer> vanswerList = vanswerRepository.findAll();
        assertThat(vanswerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkUrlvanserIsRequired() throws Exception {
        int databaseSizeBeforeTest = vanswerRepository.findAll().size();
        // set the field null
        vanswer.setUrlvanser(null);

        // Create the Vanswer, which fails.
        VanswerDTO vanswerDTO = vanswerMapper.toDto(vanswer);

        restVanswerMockMvc.perform(post("/api/vanswers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vanswerDTO)))
            .andExpect(status().isBadRequest());

        List<Vanswer> vanswerList = vanswerRepository.findAll();
        assertThat(vanswerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllVanswers() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList
        restVanswerMockMvc.perform(get("/api/vanswers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vanswer.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].urlvanser").value(hasItem(DEFAULT_URLVANSER.toString())))
            .andExpect(jsonPath("$.[*].accepted").value(hasItem(DEFAULT_ACCEPTED.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getVanswer() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get the vanswer
        restVanswerMockMvc.perform(get("/api/vanswers/{id}", vanswer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(vanswer.getId().intValue()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()))
            .andExpect(jsonPath("$.urlvanser").value(DEFAULT_URLVANSER.toString()))
            .andExpect(jsonPath("$.accepted").value(DEFAULT_ACCEPTED.booleanValue()));
    }

    @Test
    @Transactional
    public void getAllVanswersByCreationDateIsEqualToSomething() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where creationDate equals to DEFAULT_CREATION_DATE
        defaultVanswerShouldBeFound("creationDate.equals=" + DEFAULT_CREATION_DATE);

        // Get all the vanswerList where creationDate equals to UPDATED_CREATION_DATE
        defaultVanswerShouldNotBeFound("creationDate.equals=" + UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void getAllVanswersByCreationDateIsInShouldWork() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where creationDate in DEFAULT_CREATION_DATE or UPDATED_CREATION_DATE
        defaultVanswerShouldBeFound("creationDate.in=" + DEFAULT_CREATION_DATE + "," + UPDATED_CREATION_DATE);

        // Get all the vanswerList where creationDate equals to UPDATED_CREATION_DATE
        defaultVanswerShouldNotBeFound("creationDate.in=" + UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void getAllVanswersByCreationDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where creationDate is not null
        defaultVanswerShouldBeFound("creationDate.specified=true");

        // Get all the vanswerList where creationDate is null
        defaultVanswerShouldNotBeFound("creationDate.specified=false");
    }

    @Test
    @Transactional
    public void getAllVanswersByUrlvanserIsEqualToSomething() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where urlvanser equals to DEFAULT_URLVANSER
        defaultVanswerShouldBeFound("urlvanser.equals=" + DEFAULT_URLVANSER);

        // Get all the vanswerList where urlvanser equals to UPDATED_URLVANSER
        defaultVanswerShouldNotBeFound("urlvanser.equals=" + UPDATED_URLVANSER);
    }

    @Test
    @Transactional
    public void getAllVanswersByUrlvanserIsInShouldWork() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where urlvanser in DEFAULT_URLVANSER or UPDATED_URLVANSER
        defaultVanswerShouldBeFound("urlvanser.in=" + DEFAULT_URLVANSER + "," + UPDATED_URLVANSER);

        // Get all the vanswerList where urlvanser equals to UPDATED_URLVANSER
        defaultVanswerShouldNotBeFound("urlvanser.in=" + UPDATED_URLVANSER);
    }

    @Test
    @Transactional
    public void getAllVanswersByUrlvanserIsNullOrNotNull() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where urlvanser is not null
        defaultVanswerShouldBeFound("urlvanser.specified=true");

        // Get all the vanswerList where urlvanser is null
        defaultVanswerShouldNotBeFound("urlvanser.specified=false");
    }

    @Test
    @Transactional
    public void getAllVanswersByAcceptedIsEqualToSomething() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where accepted equals to DEFAULT_ACCEPTED
        defaultVanswerShouldBeFound("accepted.equals=" + DEFAULT_ACCEPTED);

        // Get all the vanswerList where accepted equals to UPDATED_ACCEPTED
        defaultVanswerShouldNotBeFound("accepted.equals=" + UPDATED_ACCEPTED);
    }

    @Test
    @Transactional
    public void getAllVanswersByAcceptedIsInShouldWork() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where accepted in DEFAULT_ACCEPTED or UPDATED_ACCEPTED
        defaultVanswerShouldBeFound("accepted.in=" + DEFAULT_ACCEPTED + "," + UPDATED_ACCEPTED);

        // Get all the vanswerList where accepted equals to UPDATED_ACCEPTED
        defaultVanswerShouldNotBeFound("accepted.in=" + UPDATED_ACCEPTED);
    }

    @Test
    @Transactional
    public void getAllVanswersByAcceptedIsNullOrNotNull() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        // Get all the vanswerList where accepted is not null
        defaultVanswerShouldBeFound("accepted.specified=true");

        // Get all the vanswerList where accepted is null
        defaultVanswerShouldNotBeFound("accepted.specified=false");
    }

    @Test
    @Transactional
    public void getAllVanswersByVthumbIsEqualToSomething() throws Exception {
        // Initialize the database
        Vthumb vthumb = VthumbResourceIntTest.createEntity(em);
        em.persist(vthumb);
        em.flush();
        vanswer.addVthumb(vthumb);
        vanswerRepository.saveAndFlush(vanswer);
        Long vthumbId = vthumb.getId();

        // Get all the vanswerList where vthumb equals to vthumbId
        defaultVanswerShouldBeFound("vthumbId.equals=" + vthumbId);

        // Get all the vanswerList where vthumb equals to vthumbId + 1
        defaultVanswerShouldNotBeFound("vthumbId.equals=" + (vthumbId + 1));
    }


    @Test
    @Transactional
    public void getAllVanswersByUserIsEqualToSomething() throws Exception {
        // Initialize the database
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        vanswer.setUser(user);
        vanswerRepository.saveAndFlush(vanswer);
        Long userId = user.getId();

        // Get all the vanswerList where user equals to userId
        defaultVanswerShouldBeFound("userId.equals=" + userId);

        // Get all the vanswerList where user equals to userId + 1
        defaultVanswerShouldNotBeFound("userId.equals=" + (userId + 1));
    }


    @Test
    @Transactional
    public void getAllVanswersByVquestionIsEqualToSomething() throws Exception {
        // Initialize the database
        Vquestion vquestion = VquestionResourceIntTest.createEntity(em);
        em.persist(vquestion);
        em.flush();
        vanswer.setVquestion(vquestion);
        vanswerRepository.saveAndFlush(vanswer);
        Long vquestionId = vquestion.getId();

        // Get all the vanswerList where vquestion equals to vquestionId
        defaultVanswerShouldBeFound("vquestionId.equals=" + vquestionId);

        // Get all the vanswerList where vquestion equals to vquestionId + 1
        defaultVanswerShouldNotBeFound("vquestionId.equals=" + (vquestionId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned
     */
    private void defaultVanswerShouldBeFound(String filter) throws Exception {
        restVanswerMockMvc.perform(get("/api/vanswers?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vanswer.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].urlvanser").value(hasItem(DEFAULT_URLVANSER.toString())))
            .andExpect(jsonPath("$.[*].accepted").value(hasItem(DEFAULT_ACCEPTED.booleanValue())));

        // Check, that the count call also returns 1
        restVanswerMockMvc.perform(get("/api/vanswers/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned
     */
    private void defaultVanswerShouldNotBeFound(String filter) throws Exception {
        restVanswerMockMvc.perform(get("/api/vanswers?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restVanswerMockMvc.perform(get("/api/vanswers/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingVanswer() throws Exception {
        // Get the vanswer
        restVanswerMockMvc.perform(get("/api/vanswers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVanswer() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        int databaseSizeBeforeUpdate = vanswerRepository.findAll().size();

        // Update the vanswer
        Vanswer updatedVanswer = vanswerRepository.findById(vanswer.getId()).get();
        // Disconnect from session so that the updates on updatedVanswer are not directly saved in db
        em.detach(updatedVanswer);
        updatedVanswer
            .creationDate(UPDATED_CREATION_DATE)
            .urlvanser(UPDATED_URLVANSER)
            .accepted(UPDATED_ACCEPTED);
        VanswerDTO vanswerDTO = vanswerMapper.toDto(updatedVanswer);

        restVanswerMockMvc.perform(put("/api/vanswers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vanswerDTO)))
            .andExpect(status().isOk());

        // Validate the Vanswer in the database
        List<Vanswer> vanswerList = vanswerRepository.findAll();
        assertThat(vanswerList).hasSize(databaseSizeBeforeUpdate);
        Vanswer testVanswer = vanswerList.get(vanswerList.size() - 1);
        assertThat(testVanswer.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testVanswer.getUrlvanser()).isEqualTo(UPDATED_URLVANSER);
        assertThat(testVanswer.isAccepted()).isEqualTo(UPDATED_ACCEPTED);

        // Validate the Vanswer in Elasticsearch
        verify(mockVanswerSearchRepository, times(1)).save(testVanswer);
    }

    @Test
    @Transactional
    public void updateNonExistingVanswer() throws Exception {
        int databaseSizeBeforeUpdate = vanswerRepository.findAll().size();

        // Create the Vanswer
        VanswerDTO vanswerDTO = vanswerMapper.toDto(vanswer);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVanswerMockMvc.perform(put("/api/vanswers")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(vanswerDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Vanswer in the database
        List<Vanswer> vanswerList = vanswerRepository.findAll();
        assertThat(vanswerList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Vanswer in Elasticsearch
        verify(mockVanswerSearchRepository, times(0)).save(vanswer);
    }

    @Test
    @Transactional
    public void deleteVanswer() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);

        int databaseSizeBeforeDelete = vanswerRepository.findAll().size();

        // Get the vanswer
        restVanswerMockMvc.perform(delete("/api/vanswers/{id}", vanswer.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Vanswer> vanswerList = vanswerRepository.findAll();
        assertThat(vanswerList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Vanswer in Elasticsearch
        verify(mockVanswerSearchRepository, times(1)).deleteById(vanswer.getId());
    }

    @Test
    @Transactional
    public void searchVanswer() throws Exception {
        // Initialize the database
        vanswerRepository.saveAndFlush(vanswer);
        when(mockVanswerSearchRepository.search(queryStringQuery("id:" + vanswer.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(vanswer), PageRequest.of(0, 1), 1));
        // Search the vanswer
        restVanswerMockMvc.perform(get("/api/_search/vanswers?query=id:" + vanswer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vanswer.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].urlvanser").value(hasItem(DEFAULT_URLVANSER)))
            .andExpect(jsonPath("$.[*].accepted").value(hasItem(DEFAULT_ACCEPTED.booleanValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vanswer.class);
        Vanswer vanswer1 = new Vanswer();
        vanswer1.setId(1L);
        Vanswer vanswer2 = new Vanswer();
        vanswer2.setId(vanswer1.getId());
        assertThat(vanswer1).isEqualTo(vanswer2);
        vanswer2.setId(2L);
        assertThat(vanswer1).isNotEqualTo(vanswer2);
        vanswer1.setId(null);
        assertThat(vanswer1).isNotEqualTo(vanswer2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(VanswerDTO.class);
        VanswerDTO vanswerDTO1 = new VanswerDTO();
        vanswerDTO1.setId(1L);
        VanswerDTO vanswerDTO2 = new VanswerDTO();
        assertThat(vanswerDTO1).isNotEqualTo(vanswerDTO2);
        vanswerDTO2.setId(vanswerDTO1.getId());
        assertThat(vanswerDTO1).isEqualTo(vanswerDTO2);
        vanswerDTO2.setId(2L);
        assertThat(vanswerDTO1).isNotEqualTo(vanswerDTO2);
        vanswerDTO1.setId(null);
        assertThat(vanswerDTO1).isNotEqualTo(vanswerDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(vanswerMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(vanswerMapper.fromId(null)).isNull();
    }
}
