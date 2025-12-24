import React, { useState, useEffect } from 'react';
import './KayitliKartlarımContent.css';
import { MdAddCard, MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Modal from '../../components/Modal';


// Dinamik banka prefix veritabanı - gerçek BIN numaraları ve range'ler
const BANK_PREFIXES = {
  ziraat: ['444676', '444677', '444678', '444679', '444680', '444681', '444682', '444683', '444684', '444685', '444686', '444687', '444688', '444689', '444690', '444691', '444692', '444693', '444694', '444695', '444696', '444697', '444698', '444699', '444700', '444701', '444702', '444703', '444704', '444705', '444706', '444707', '444708', '444709', '444710', '444711', '444712', '444713', '444714', '444715', '444716', '444717', '444718', '444719', '444720', '444721', '444722', '444723', '444724', '444725', '444726', '444727', '444728', '444729', '444730', '444731', '444732', '444733', '444734', '444735', '444736', '444737', '444738', '444739', '444740', '444741', '444742', '444743', '444744', '444745', '444746', '444747', '444748', '444749', '444750', '444751', '444752', '444753', '444754', '444755', '444756', '444757', '444758', '444759', '444760', '444761', '444762', '444763', '444764', '444765', '444766', '444767', '444768', '444769', '444770', '444771', '444772', '444773', '444774', '444775', '444776', '444777', '444778', '444779', '444780', '444781', '444782', '444783', '444784', '444785', '444786', '444787', '444788', '444789', '444790', '444791', '444792', '444793', '444794', '444795', '444796', '444797', '444798', '444799', '444800', '444801', '444802', '444803', '444804', '444805', '444806', '444807', '444808', '444809', '444810', '444811', '444812', '444813', '444814', '444815', '444816', '444817', '444818', '444819', '444820', '444821', '444822', '444823', '444824', '444825', '444826', '444827', '444828', '444829', '444830', '444831', '444832', '444833', '444834', '444835', '444836', '444837', '444838', '444839', '444840', '444841', '444842', '444843', '444844', '444845', '444846', '444847', '444848', '444849', '444850', '444851', '444852', '444853', '444854', '444855', '444856', '444857', '444858', '444859', '444860', '444861', '444862', '444863', '444864', '444865', '444866', '444867', '444868', '444869', '444870', '444871', '444872', '444873', '444874', '444875', '444876', '444877', '444878', '444879', '444880', '444881', '444882', '444883', '444884', '444885', '444886', '444887', '444888', '444889', '444890', '444891', '444892', '444893', '444894', '444895', '444896', '444897', '444898', '444899', '444900', '444901', '444902', '444903', '444904', '444905', '444906', '444907', '444908', '444909', '444910', '444911', '444912', '444913', '444914', '444915', '444916', '444917', '444918', '444919', '444920', '444921', '444922', '444923', '444924', '444925', '444926', '444927', '444928', '444929', '444930', '444931', '444932', '444933', '444934', '444935', '444936', '444937', '444938', '444939', '444940', '444941', '444942', '444943', '444944', '444945', '444946', '444947', '444948', '444949', '444950', '444951', '444952', '444953', '444954', '444955', '444956', '444957', '444958', '444959', '444960', '444961', '444962', '444963', '444964', '444965', '444966', '444967', '444968', '444969', '444970', '444971', '444972', '444973', '444974', '444975', '444976', '444977', '444978', '444979', '444980', '444981', '444982', '444983', '444984', '444985', '444986', '444987', '444988', '444989', '444990', '444991', '444992', '444993', '444994', '444995', '444996', '444997', '444998', '444999', '528208', '528209', '528210', '528211', '528212', '528213', '528214', '528215', '528216', '528217', '528218', '528219', '528220', '528221', '528222', '528223', '528224', '528225', '528226', '528227', '528228', '528229', '528230', '528231', '528232', '528233', '528234', '528235', '528236', '528237', '528238', '528239', '528240', '528241', '528242', '528243', '528244', '528245', '528246', '528247', '528248', '528249', '528250', '528251', '528252', '528253', '528254', '528255', '528256', '528257', '528258', '528259', '528260', '528261', '528262', '528263', '528264', '528265', '528266', '528267', '528268', '528269', '528270', '528271', '528272', '528273', '528274', '528275', '528276', '528277', '528278', '528279', '528280', '528281', '528282', '528283', '528284', '528285', '528286', '528287', '528288', '528289', '528290', '528291', '528292', '528293', '528294', '528295', '528296', '528297', '528298', '528299', '528300', '658755', '658756', '658757', '658758', '658759', '658760', '658761', '658762', '658763', '658764', '658765', '658766', '658767', '658768', '658769', '658770', '658771', '658772', '658773', '658774', '658775', '658776', '658777', '658778', '658779', '658780', '658781', '658782', '658783', '658784', '658785', '658786', '658787', '658788', '658789', '658790', '658791', '658792', '658793', '658794', '658795', '658796', '658797', '658798', '658799', '658800', '979280', '979281', '979282', '979283', '979284', '979285', '979286', '979287', '979288', '979289', '979290', '979291', '979292', '979293', '979294', '979295', '979296', '979297', '979298', '979299', '979300'],
  garanti: ['489455', '489456', '489457', '489458', '489459', '489460', '489461', '489462', '489463', '489464', '489465', '489466', '489467', '489468', '489469', '489470', '489471', '489472', '489473', '489474', '489475', '489476', '489477', '489478', '489479', '489480', '489481', '489482', '489483', '489484', '489485', '489486', '489487', '489488', '489489', '489490', '489491', '489492', '489493', '489494', '489495', '489496', '489497', '489498', '489499', '489500', '517041', '517042', '517043', '517044', '517045', '517046', '517047', '517048', '517049', '517050', '517051', '517052', '517053', '517054', '517055', '517056', '517057', '517058', '517059', '517060', '517061', '517062', '517063', '517064', '517065', '517066', '517067', '517068', '517069', '517070', '517071', '517072', '517073', '517074', '517075', '517076', '517077', '517078', '517079', '517080', '517081', '517082', '517083', '517084', '517085', '517086', '517087', '517088', '517089', '517090', '517091', '517092', '517093', '517094', '517095', '517096', '517097', '517098', '517099', '517100', '540667', '540668', '540669', '540670', '540671', '540672', '540673', '540674', '540675', '540676', '540677', '540678', '540679', '540680', '540681', '540682', '540683', '540684', '540685', '540686', '540687', '540688', '540689', '540690', '540691', '540692', '540693', '540694', '540695', '540696', '540697', '540698', '540699', '540700', '540701', '540702', '540703', '540704', '540705', '540706', '540707', '540708', '540709', '540710', '540711', '540712', '540713', '540714', '540715', '540716', '540717', '540718', '540719', '540720', '540721', '540722', '540723', '540724', '540725', '540726', '540727', '540728', '540729', '540730', '540731', '540732', '540733', '540734', '540735', '540736', '540737', '540738', '540739', '540740', '540741', '540742', '540743', '540744', '540745', '540746', '540747', '540748', '540749', '540750', '540751', '540752', '540753', '540754', '540755', '540756', '540757', '540758', '540759', '540760', '540761', '540762', '540763', '540764', '540765', '540766', '540767', '540768', '540769', '540770', '540771', '540772', '540773', '540774', '540775', '540776', '540777', '540778', '540779', '540780', '540781', '540782', '540783', '540784', '540785', '540786', '540787', '540788', '540789', '540790', '540791', '540792', '540793', '540794', '540795', '540796', '540797', '540798', '540799', '540800', '979236', '979237', '979238', '979239', '979240', '979241', '979242', '979243', '979244', '979245', '979246', '979247', '979248', '979249', '979250'],
  yapikredi: ['491206', '491207', '491208', '491209', '491210', '491211', '491212', '491213', '491214', '491215', '491216', '491217', '491218', '491219', '491220', '491221', '491222', '491223', '491224', '491225', '491226', '491227', '491228', '491229', '491230', '491231', '491232', '491233', '491234', '491235', '491236', '491237', '491238', '491239', '491240', '491241', '491242', '491243', '491244', '491245', '491246', '491247', '491248', '491249', '491250', '540061', '540062', '540063', '540064', '540065', '540066', '540067', '540068', '540069', '540070', '540071', '540072', '540073', '540074', '540075', '540076', '540077', '540078', '540079', '540080', '540081', '540082', '540083', '540084', '540085', '540086', '540087', '540088', '540089', '540090', '540091', '540092', '540093', '540094', '540095', '540096', '540097', '540098', '540099', '540100', '545103', '545104', '545105', '545106', '545107', '545108', '545109', '545110', '545111', '545112', '545113', '545114', '545115', '545116', '545117', '545118', '545119', '545120', '545121', '545122', '545123', '545124', '545125', '545126', '545127', '545128', '545129', '545130', '545131', '545132', '545133', '545134', '545135', '545136', '545137', '545138', '545139', '545140', '545141', '545142', '545143', '545144', '545145', '545146', '545147', '545148', '545149', '545150', '545151', '545152', '545153', '545154', '545155', '545156', '545157', '545158', '545159', '545160', '545161', '545162', '545163', '545164', '545165', '545166', '545167', '545168', '545169', '545170', '545171', '545172', '545173', '545174', '545175', '545176', '545177', '545178', '545179', '545180', '545181', '545182', '545183', '545184', '545185', '545186', '545187', '545188', '545189', '545190', '545191', '545192', '545193', '545194', '545195', '545196', '545197', '545198', '545199', '545200'],
  akbank: ['557113', '557114', '557115', '557116', '557117', '557118', '557119', '557120', '557121', '557122', '557123', '557124', '557125', '557126', '557127', '557128', '557129', '557130', '557131', '557132', '557133', '557134', '557135', '557136', '557137', '557138', '557139', '557140', '557141', '557142', '557143', '557144', '557145', '557146', '557147', '557148', '557149', '557150', '557151', '557152', '557153', '557154', '557155', '557156', '557157', '557158', '557159', '557160', '557161', '557162', '557163', '557164', '557165', '557166', '557167', '557168', '557169', '557170', '557171', '557172', '557173', '557174', '557175', '557176', '557177', '557178', '557179', '557180', '557181', '557182', '557183', '557184', '557185', '557186', '557187', '557188', '557189', '557190', '557191', '557192', '557193', '557194', '557195', '557196', '557197', '557198', '557199', '557200'],
  isbankasi: ['454360', '454361', '454362', '454363', '454364', '454365', '454366', '454367', '454368', '454369', '454370', '454371', '454372', '454373', '454374', '454375', '454376', '454377', '454378', '454379', '454380', '454381', '454382', '454383', '454384', '454385', '454386', '454387', '454388', '454389', '454390', '454391', '454392', '454393', '454394', '454395', '454396', '454397', '454398', '454399', '454400', '454401', '454402', '454403', '454404', '454405', '454406', '454407', '454408', '454409', '454410', '454411', '454412', '454413', '454414', '454415', '454416', '454417', '454418', '454419', '454420', '454421', '454422', '454423', '454424', '454425', '454426', '454427', '454428', '454429', '454430', '454431', '454432', '454433', '454434', '454435', '454436', '454437', '454438', '454439', '454440', '454441', '454442', '454443', '454444', '454445', '454446', '454447', '454448', '454449', '454450', '454451', '454452', '454453', '454454', '454455', '454456', '454457', '454458', '454459', '454460', '454461', '454462', '454463', '454464', '454465', '454466', '454467', '454468', '454469', '454470', '454471', '454472', '454473', '454474', '454475', '454476', '454477', '454478', '454479', '454480', '454481', '454482', '454483', '454484', '454485', '454486', '454487', '454488', '454489', '454490', '454491', '454492', '454493', '454494', '454495', '454496', '454497', '454498', '454499', '454500'],
  halkbank: ['442500', '442501', '442502', '442503', '442504', '442505', '442506', '442507', '442508', '442509', '442510', '442511', '442512', '442513', '442514', '442515', '442516', '442517', '442518', '442519', '442520', '442521', '442522', '442523', '442524', '442525', '442526', '442527', '442528', '442529', '442530', '442531', '442532', '442533', '442534', '442535', '442536', '442537', '442538', '442539', '442540', '442541', '442542', '442543', '442544', '442545', '442546', '442547', '442548', '442549', '442550', '442551', '442552', '442553', '442554', '442555', '442556', '442557', '442558', '442559', '442560', '442561', '442562', '442563', '442564', '442565', '442566', '442567', '442568', '442569', '442570', '442571', '442572', '442573', '442574', '442575', '442576', '442577', '442578', '442579', '442580', '442581', '442582', '442583', '442584', '442585', '442586', '442587', '442588', '442589', '442590', '442591', '442592', '442593', '442594', '442595', '442596', '442597', '442598', '442599', '442600', '442601', '442602', '442603', '442604', '442605', '442606', '442607', '442608', '442609', '442610', '442611', '442612', '442613', '442614', '442615', '442616', '442617', '442618', '442619', '442620', '442621', '442622', '442623', '442624', '442625', '442626', '442627', '442628', '442629', '442630', '442631', '442632', '442633', '442634', '442635', '442636', '442637', '442638', '442639', '442640', '442641', '442642', '442643', '442644', '442645', '442646', '442647', '442648', '442649', '442650', '442651', '442652', '442653', '442654', '442655', '442656', '442657', '442658', '442659', '442660', '442661', '442662', '442663', '442664', '442665', '442666', '442667', '442668', '442669', '442670', '442671', '442672', '442673', '442674', '442675', '442676', '442677', '442678', '442679', '442680', '442681', '442682', '442683', '442684', '442685', '442686', '442687', '442688', '442689', '442690', '442691', '442692', '442693', '442694', '442695', '442696', '442697', '442698', '442699', '442700', '552879', '552880', '552881', '552882', '552883', '552884', '552885', '552886', '552887', '552888', '552889', '552890', '552891', '552892', '552893', '552894', '552895', '552896', '552897', '552898', '552899', '552900', '552901', '552902', '552903', '552904', '552905', '552906', '552907', '552908', '552909', '552910', '552911', '552912', '552913', '552914', '552915', '552916', '552917', '552918', '552919', '552920', '552921', '552922', '552923', '552924', '552925', '552926', '552927', '552928', '552929', '552930', '552931', '552932', '552933', '552934', '552935', '552936', '552937', '552938', '552939', '552940', '552941', '552942', '552943', '552944', '552945', '552946', '552947', '552948', '552949', '552950'],
  vakifbank: ['415565', '415566', '415567', '415568', '415569', '415570', '415571', '415572', '415573', '415574', '415575', '415576', '415577', '415578', '415579', '415580', '415581', '415582', '415583', '415584', '415585', '415586', '415587', '415588', '415589', '415590', '415591', '415592', '415593', '415594', '415595', '415596', '415597', '415598', '415599', '415600', '415601', '415602', '415603', '415604', '415605', '415606', '415607', '415608', '415609', '415610', '415611', '415612', '415613', '415614', '415615', '415616', '415617', '415618', '415619', '415620', '415621', '415622', '415623', '415624', '415625', '415626', '415627', '415628', '415629', '415630', '415631', '415632', '415633', '415634', '415635', '415636', '415637', '415638', '415639', '415640', '415641', '415642', '415643', '415644', '415645', '415646', '415647', '415648', '415649', '415650', '415651', '415652', '415653', '415654', '415655', '415656', '415657', '415658', '415659', '415660', '415661', '415662', '415663', '415664', '415665', '415666', '415667', '415668', '415669', '415670', '415671', '415672', '415673', '415674', '415675', '415676', '415677', '415678', '415679', '415680', '415681', '415682', '415683', '415684', '415685', '415686', '415687', '415688', '415689', '415690', '415691', '415692', '415693', '415694', '415695', '415696', '415697', '415698', '415699', '415700'],
  denizbank: ['554960', '554961', '554962', '554963', '554964', '554965', '554966', '554967', '554968', '554969', '554970', '554971', '554972', '554973', '554974', '554975', '554976', '554977', '554978', '554979', '554980', '554981', '554982', '554983', '554984', '554985', '554986', '554987', '554988', '554989', '554990', '554991', '554992', '554993', '554994', '554995', '554996', '554997', '554998', '554999', '555000', '555001', '555002', '555003', '555004', '555005', '555006', '555007', '555008', '555009', '555010', '555011', '555012', '555013', '555014', '555015', '555016', '555017', '555018', '555019', '555020', '555021', '555022', '555023', '555024', '555025', '555026', '555027', '555028', '555029', '555030', '555031', '555032', '555033', '555034', '555035', '555036', '555037', '555038', '555039', '555040', '555041', '555042', '555043', '555044', '555045', '555046', '555047', '555048', '555049', '555050'],
  qnb: ['520017', '520018', '520019', '520020', '520021', '520022', '520023', '520024', '520025', '520026', '520027', '520028', '520029', '520030', '520031', '520032', '520033', '520034', '520035', '520036', '520037', '520038', '520039', '520040', '520041', '520042', '520043', '520044', '520045', '520046', '520047', '520048', '520049', '520050', '520051', '520052', '520053', '520054', '520055', '520056', '520057', '520058', '520059', '520060', '520061', '520062', '520063', '520064', '520065', '520066', '520067', '520068', '520069', '520070', '520071', '520072', '520073', '520074', '520075', '520076', '520077', '520078', '520079', '520080', '520081', '520082', '520083', '520084', '520085', '520086', '520087', '520088', '520089', '520090', '520091', '520092', '520093', '520094', '520095', '520096', '520097', '520098', '520099', '520100'],
  teb: ['535186', '535187', '535188', '535189', '535190', '535191', '535192', '535193', '535194', '535195', '535196', '535197', '535198', '535199', '535200', '535201', '535202', '535203', '535204', '535205', '535206', '535207', '535208', '535209', '535210', '535211', '535212', '535213', '535214', '535215', '535216', '535217', '535218', '535219', '535220', '535221', '535222', '535223', '535224', '535225', '535226', '535227', '535228', '535229', '535230', '535231', '535232', '535233', '535234', '535235', '535236', '535237', '535238', '535239', '535240', '535241', '535242', '535243', '535244', '535245', '535246', '535247', '535248', '535249', '535250'],
  ing: ['540025', '540026', '540027', '540028', '540029', '540030', '540031', '540032', '540033', '540034', '540035', '540036', '540037', '540038', '540039', '540040', '540041', '540042', '540043', '540044', '540045', '540046', '540047', '540048', '540049', '540050', '540051', '540052', '540053', '540054', '540055', '540056', '540057', '540058', '540059', '540060', '540061', '540062', '540063', '540064', '540065', '540066', '540067', '540068', '540069', '540070', '540071', '540072', '540073', '540074', '540075', '540076', '540077', '540078', '540079', '540080', '540081', '540082', '540083', '540084', '540085', '540086', '540087', '540088', '540089', '540090', '540091', '540092', '540093', '540094', '540095', '540096', '540097', '540098', '540099', '540100'],
  hsbc: ['550473', '550474', '550475', '550476', '550477', '550478', '550479', '550480', '550481', '550482', '550483', '550484', '550485', '550486', '550487', '550488', '550489', '550490', '550491', '550492', '550493', '550494', '550495', '550496', '550497', '550498', '550499', '550500', '550501', '550502', '550503', '550504', '550505', '550506', '550507', '550508', '550509', '550510', '550511', '550512', '550513', '550514', '550515', '550516', '550517', '550518', '550519', '550520', '550521', '550522', '550523', '550524', '550525', '550526', '550527', '550528', '550529', '550530', '550531', '550532', '550533', '550534', '550535', '550536', '550537', '550538', '550539', '550540', '550541', '550542', '550543', '550544', '550545', '550546', '550547', '550548', '550549', '550550']
};

// Dinamik banka algılama fonksiyonu
const detectBankAndBrand = (number) => {
  const cleanNumber = number.replace(/\s/g, '');

  let result = {
    bank: '',
    brand: ''
  };

  // Kart tipi algılama (BIN'in ilk hanesine göre)
  if (cleanNumber.startsWith('4')) {
    result.brand = 'visa';
  } else if (cleanNumber.startsWith('5')) {
    result.brand = 'mastercard';
  } else if (cleanNumber.startsWith('9')) {
    result.brand = 'troy';
  }

  // Önce 6 haneli prefix kontrolü yap
  if (cleanNumber.length >= 6) {
    const prefix6 = cleanNumber.substring(0, 6);
    
    // Her banka için prefix kontrolü yap
    for (const [bankName, prefixes] of Object.entries(BANK_PREFIXES)) {
      if (prefixes.includes(prefix6)) {
        result.bank = bankName;
        break;
      }
    }
  }
  
  // Eğer 6 haneli prefix ile eşleşme bulunamadıysa, 4 haneli prefix dene
  if (!result.bank && cleanNumber.length >= 4) {
    const prefix4 = cleanNumber.substring(0, 4);
    
    // Her banka için 6 haneli prefix'lerin ilk 4 hanesini kontrol et
    for (const [bankName, prefixes] of Object.entries(BANK_PREFIXES)) {
      // 6 haneli prefix'lerin ilk 4 hanesi ile eşleşme var mı kontrol et
      const matchingPrefix = prefixes.find(p => p.startsWith(prefix4));
      if (matchingPrefix) {
        result.bank = bankName;
        break;
      }
    }
  }

  // Eğer hala banka bulunamadıysa 'other' olarak işaretle
  if (!result.bank) {
    result.bank = 'other';
  }

  return result;
};

const BANK_INFO = {
  ziraat: { name: 'Ziraat Bankası', logo: '/assets/AccountPage/ziraat-logo.webp' },
  yapikredi: { name: 'Yapı Kredi', logo: '/assets/AccountPage/yapikredi-logo.png' },
  garanti: { name: 'Garanti BBVA', logo: '/assets/AccountPage/garanti-logo.png' },
  akbank: { name: 'Akbank', logo: '/assets/AccountPage/akbank-logo.png' },
  denizbank: { name: 'Denizbank', logo: '/assets/AccountPage/denizbank-logo.png' },
  vakifbank: { name: 'Vakıfbank', logo: '/assets/AccountPage/vakifbank-logo.png' },
  halkbank: { name: 'Halkbank', logo: '/assets/AccountPage/halkbank-logo.png' },
  qnb: { name: 'QNB Finansbank', logo: '/assets/AccountPage/qnb-logo.png' },
  teb: { name: 'TEB', logo: '/assets/AccountPage/teb-logo.png' },
  ing: { name: 'ING Bank', logo: '/assets/AccountPage/ing-logo.png' },
  hsbc: { name: 'HSBC', logo: '/assets/AccountPage/hsbc-logo.png' },
  isbankasi: { name: 'İş Bankası', logo: '/assets/AccountPage/isbankasi-logo.png' }, 
  other: { name: 'Diğer', logo: '/assets/AccountPage/ziraat-logo.webp' }
};

// Logo Getirici
const getBankLogo = (bankName) => {
  return BANK_INFO[bankName]?.logo || BANK_INFO.other.logo;
};

// Banka ismi getirici
const getBankName = (bankName) => {
  return BANK_INFO[bankName]?.name || BANK_INFO.other.name;
};

// Brand Logo Getirici
const getBrandLogo = (brandName) => {
  if (brandName === 'visa') return '/assets/AccountPage/visa-brand.svg';
  if (brandName === 'mastercard') return '/assets/AccountPage/mastercard-logo.webp';
  if (brandName === 'troy') return '/assets/AccountPage/troy-logo.png';
  return null; // Logo bulunamazsa null döndür
};



const CardDetail = ({ card, onEdit, onDelete }) => {
  // Kart numarasını temizle ve son 4 hanesini al
  const cleanCardNumber = (card.cardNumber || '').replace(/\s/g, '');
  const lastFour = cleanCardNumber.length >= 4 ? cleanCardNumber.slice(-4) : cleanCardNumber;
  const maskedNumber = `**** **** **** ${lastFour}`;
  const bankLogo = getBankLogo(card.bank);
  const brandLogo = getBrandLogo(card.brand);
  
  return (
    <div className="card-form">
      <div className="head">
        <div className="name"><h2>{card.alias}</h2></div>
        <div className="right-card">
          <div className="card">
            <div className="card-logo">
              {bankLogo && <img src={bankLogo} alt={card.bank || 'Banka'} onError={(e) => { e.target.style.display = 'none'; }} />}
            </div>
            <div className="card-value"><span>{maskedNumber}</span></div>
          </div>
          <div className="card-brand">
            {brandLogo && <img src={brandLogo} alt={card.brand || 'Kart'} onError={(e) => { e.target.style.display = 'none'; }} />}
          </div>
        </div>
      </div>
      <div className="delete-card">
        <button onClick={() => onEdit(card)}><FaEdit className='edit-button-icon' />Düzenle</button>
        <button onClick={() => onDelete(card.id)}><MdDeleteForever className='delete-button-icon' />Sil</button>
      </div>
    </div>
  );
};

const KayitliKartlarımContent = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');

  const [formData, setFormData] = useState({
    id: null,
    alias: '',
    holderName: '',
    cardNumber: '',
    expDate: '',
    bank: '',
    brand: ''
  });

  // Kartları yükle
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const userData = localStorage.getItem('user');
        if (!userData) {
          setMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor.' });
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        if (!user || !user.id) {
          setMessage({ type: 'error', text: 'Kullanıcı bilgisi bulunamadı.' });
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/user/cards?userId=${user.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Kartlar yüklenirken bir hata oluştu.');
        }

        setCards(data.cards || []);
      } catch (err) {
        console.error('Kart yükleme hatası:', err);
        setMessage({ type: 'error', text: err.message || 'Kartlar yüklenirken bir hata oluştu.' });
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);


  // Son kullanma tarihi formatlama fonksiyonu (MM/YY)
  const formatExpDate = (value) => {
    // Sadece rakamları al
    const digits = value.replace(/\D/g, '').slice(0, 4);
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    // 2'den fazla rakam varsa "/" ekle
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  };

  // Kart numarası formatlama fonksiyonu (4'er haneli gruplar)
  const formatCardNumber = (value) => {
    // Sadece rakamları al
    const digits = value.replace(/\D/g, '').slice(0, 19);
    
    if (digits.length === 0) return '';
    
    // 4'er haneli gruplar halinde formatla
    const groups = [];
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.substring(i, i + 4));
    }
    
    return groups.join(' ');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // EĞER DEĞİŞEN ALAN 'cardNumber' İSE OTOMATİK FORMATLA VE SADECE MARKA ALGILA
      if (name === 'cardNumber') {
        // Kart numarasını formatla
        const formatted = formatCardNumber(value);
        newData.cardNumber = formatted;
        
        // Sadece kart markası algıla (Visa/Mastercard/Troy) - Banka algılama yok
        const cleanNumber = value.replace(/\D/g, '');
        if (cleanNumber.length >= 1) {
          // Sadece kart markası algıla
          if (cleanNumber.startsWith('4')) {
            newData.brand = 'visa';
          } else if (cleanNumber.startsWith('5')) {
            newData.brand = 'mastercard';
          } else if (cleanNumber.startsWith('9')) {
            newData.brand = 'troy';
          } else {
            // Marka algılanamadıysa temizle
            if (cleanNumber.length < 1) {
              newData.brand = '';
            }
          }
        } else {
          newData.brand = '';
        }
      }

      // EĞER DEĞİŞEN ALAN 'expDate' İSE OTOMATİK FORMATLA
      if (name === 'expDate') {
        newData.expDate = formatExpDate(value);
      }

      return newData;
    });
  };

  const openAddModal = () => {
    setModalType('add');
    setFormData({ id: null, alias: '', holderName: '', cardNumber: '', expDate: '', bank: '', brand: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setModalType('edit');
    
    // Kart numarasını formatla
    const formattedCardNumber = formatCardNumber(card.cardNumber || '');
    
    // Sadece mevcut bilgileri kullan, otomatik algılama yok
    setFormData({
      id: card.id,
      alias: card.alias || '',
      holderName: card.holderName || '',
      cardNumber: formattedCardNumber,
      expDate: card.expDate || '',
      bank: card.bank || '',
      brand: card.brand || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.holderName || !formData.cardNumber || !formData.expDate) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun.' });
      return;
    }

    // Kart numarası validasyonu (sadece rakam, 13-19 karakter)
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      setMessage({ type: 'error', text: 'Kart numarası geçersiz.' });
      return;
    }

    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });

      const userData = localStorage.getItem('user');
      if (!userData) {
        setMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor.' });
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        setMessage({ type: 'error', text: 'Kullanıcı bilgisi bulunamadı.' });
        return;
      }

      // ExpDate'i temizle (sadece rakamlar) ve formatla
      const cleanExpDate = formData.expDate.replace(/\D/g, '');
      if (cleanExpDate.length !== 4) {
        setMessage({ type: 'error', text: 'Son kullanma tarihi geçersiz. (AA/YY formatında olmalı)' });
        setIsSaving(false);
        return;
      }
      const formattedExpDate = `${cleanExpDate.substring(0, 2)}/${cleanExpDate.substring(2, 4)}`;

      if (modalType === 'add') {
        const response = await fetch('/api/user/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            alias: formData.alias || 'Kartım',
            holderName: formData.holderName,
            cardNumber: cleanCardNumber,
            expDate: formattedExpDate,
            bank: formData.bank || '',
            brand: formData.brand || '',
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Kart eklenirken bir hata oluştu.');
        }

        // Kartları yeniden yükle
        const cardsResponse = await fetch(`/api/user/cards?userId=${user.id}`);
        const cardsData = await cardsResponse.json();
        if (cardsData.success) {
          setCards(cardsData.cards || []);
        }

        setMessage({ type: 'success', text: 'Kart başarıyla eklendi.' });
      } else {
        const response = await fetch(`/api/user/cards/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            alias: formData.alias || 'Kartım',
            holderName: formData.holderName,
            cardNumber: cleanCardNumber,
            expDate: formattedExpDate,
            bank: formData.bank || '',
            brand: formData.brand || '',
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Kart güncellenirken bir hata oluştu.');
        }

        // Kartları yeniden yükle
        const cardsResponse = await fetch(`/api/user/cards?userId=${user.id}`);
        const cardsData = await cardsResponse.json();
        if (cardsData.success) {
          setCards(cardsData.cards || []);
        }

        setMessage({ type: 'success', text: 'Kart başarıyla güncellendi.' });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Kart kaydetme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Kart kaydedilirken bir hata oluştu.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kartı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor.' });
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        setMessage({ type: 'error', text: 'Kullanıcı bilgisi bulunamadı.' });
        return;
      }

      const response = await fetch(`/api/user/cards/${id}?userId=${user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Kart silinirken bir hata oluştu.');
      }

      // Kartları yeniden yükle
      const cardsResponse = await fetch(`/api/user/cards?userId=${user.id}`);
      const cardsData = await cardsResponse.json();
      if (cardsData.success) {
        setCards(cardsData.cards || []);
      }

      setMessage({ type: 'success', text: 'Kart başarıyla silindi.' });
    } catch (err) {
      console.error('Kart silme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Kart silinirken bir hata oluştu.' });
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  return (
    <div className="carts">
      {message.text && (
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            borderRadius: '4px',
          }}
        >
          {message.text}
        </div>
      )}

      <div className="header">
        <h3>Kayıtlı Kartlarım</h3>
        <div className="add-card">
          <button onClick={openAddModal}><MdAddCard /> Yeni Kart Ekle</button>
        </div>
      </div>

      <div className="card-information">
        {cards.length === 0 ? (
          <p>Henüz kart eklemediniz.</p>
        ) : (
          cards.map(card => (
            <CardDetail key={card.id} card={card} onEdit={openEditModal} onDelete={handleDelete} />
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'add' ? 'Yeni Kart Ekle' : 'Kartı Düzenle'}>
        <form className="add-card-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Kart İsmi</label>
            <input type="text" name="alias" value={formData.alias} onChange={handleInputChange} required placeholder="Maaş Kartım" />
          </div>
            <div className="form-group">
              <label>Kart Numarası</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength="23"
                placeholder="0000 0000 0000 0000"
                required
              />
            </div>

            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleInputChange}
                required
                placeholder="Aybüke Zeren"
              />
            </div>

            <div className="form-group">
              <label>Son Kullanma Tarihi (AA/YY)</label>
              <input
                type="text"
                name="expDate"
                value={formData.expDate}
                onChange={handleInputChange}
                maxLength="5"
                placeholder="12/25"
                required
              />
            </div>

          <div className="form-row">
            <div className="form-group">
              <label>Banka</label>
              <select name="bank" value={formData.bank} onChange={handleInputChange}>
                <option value="">Seçiniz...</option>
                {Object.entries(BANK_INFO)
                  .filter(([key]) => key !== 'other')
                  .map(([key, info]) => (
                    <option key={key} value={key}>{info.name}</option>
                  ))}
                <option value="other">Diğer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kart Tipi</label>
              <input type="text" value={formData.brand.toUpperCase()} disabled style={{ backgroundColor: '#f0f0f0' }} />
            </div>
          </div>

          <button type="submit" className="card-save-btn" disabled={isSaving}>
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default KayitliKartlarımContent;