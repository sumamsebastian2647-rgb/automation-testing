// config.js
const config = {
    credentials: {
         baseUrl: 'https://rto2503.cloudemy.au/site/login',
      username: 'rto2503',
      password: 'Rto@2024$',
    },
    assessment_code:{
      AQcode:'AQ01_auto',
      LQcode:'LQ06_auto',
      HQcode:'HQ01_auto',
      PQcode:'PQ01_auto',
      Scromcode:'SQ01_auto',

    },
    assessment_name:{
      AQname:'Assess_01_AQ_Auto',
      LQname:'Assess_06_LQ_Auto',
      HQname:'Assess_01_HQ_Auto',
      PQname:'Assess_01_PQ_Auto',
      Scromname:'Assess_01_SQ_Auto',
    },
    assessment_instr:{
      instrcution:'test',
    },
    samplescrom: {
        sample: 'sample_scrom.zip',
    },
    longanswer_essay:{
      question1:'What is volcano eruption?',
      answer1:'A volcano eruption is a natural event that occurs when molten rock, known as magma, escapes from beneath the Earths crust through an opening or vent. This event can be dramatic and destructive, shaping landscapes and affecting human lives in both positive and negative ways. Volcanoes are found mainly along tectonic plate boundaries, where the Earths plates collide or pull apart. Eruptions can vary in intensity and form, from slow-flowing lava to explosive outbursts of ash and gases. The process of a volcanic eruption begins deep inside the Earth. Magma collects in a magma chamber beneath the surface. As gases build up pressure within this chamber, it eventually forces its way upward through cracks and vents. When the pressure becomes too great, the magma bursts out, sometimes accompanied by ash clouds, rock fragments, and gases like carbon dioxide and sulfur dioxide. Once magma exits the volcano, it is called lava. Volcano eruptions are classified into two main types: explosive and effusive. Explosive eruptions are violent and dangerous, often sending ash and debris miles into the air. Effusive eruptions are gentler, with lava steadily flowing down the volcano’s slopes. The type of eruption depends on the volcano’s structure, the composition of the magma, and the amount of gas pressure.',
      question2:'What is 2+2=?',
      answer2:'4',
      file1:'Volcano_Eruption_Long_Essay.pdf',
      
    },
};

module.exports = config;  // Direct export, not as default
