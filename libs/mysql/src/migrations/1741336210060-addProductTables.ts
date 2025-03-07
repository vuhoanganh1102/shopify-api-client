import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductTables1741336210060 implements MigrationInterface {
  name = 'AddProductTables1741336210060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_media\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`url\` varchar(500) NOT NULL, \`product_id\` bigint UNSIGNED NOT NULL, \`type\` int NOT NULL DEFAULT '0', \`status\` tinyint NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`option_variant\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`title\` varchar(255) NULL, \`value\` varchar(255) NULL, \`product_id\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`variant_value\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`url\` varchar(500) NULL, \`pricing\` decimal(10,2) NOT NULL, \`available\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`variants\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`product_id\` bigint UNSIGNED NOT NULL, \`option_variant_id\` bigint UNSIGNED NOT NULL, \`value_variant_id\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`category\` varchar(255) NULL, \`pricing\` decimal(10,2) NOT NULL, \`inventory\` int NOT NULL DEFAULT '0', \`quantity\` int NOT NULL DEFAULT '1', \`shipping\` json NULL, \`variants\` json NULL, \`purchase_options\` json NULL, \`metafields\` json NULL, \`search_engine_listing\` json NULL, \`product_status\` varchar(50) NOT NULL DEFAULT 'draft', \`publishing\` json NULL, \`insights\` json NULL, \`product_organization\` json NULL, \`theme_template\` varchar(255) NULL, \`shopify_product_id\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_3f16f24f1b961af087fe188b54\` (\`shopify_product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`category\` int NULL, \`product_id\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_media\` ADD CONSTRAINT \`FK_e6bb4a69096db4f6a1f5bada151\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`option_variant\` ADD CONSTRAINT \`FK_fe98dacbe692d2a3c83158c7733\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` ADD CONSTRAINT \`FK_a9625f5484e6b6941d401ec101c\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` ADD CONSTRAINT \`FK_4dd34b52d266471ed1fd07df259\` FOREIGN KEY (\`option_variant_id\`) REFERENCES \`option_variant\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` ADD CONSTRAINT \`FK_32f91b8b49afc79e612b787da05\` FOREIGN KEY (\`value_variant_id\`) REFERENCES \`variant_value\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_09c384ee09c9b0745c9d0544a38\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_09c384ee09c9b0745c9d0544a38\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` DROP FOREIGN KEY \`FK_32f91b8b49afc79e612b787da05\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` DROP FOREIGN KEY \`FK_4dd34b52d266471ed1fd07df259\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` DROP FOREIGN KEY \`FK_a9625f5484e6b6941d401ec101c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`option_variant\` DROP FOREIGN KEY \`FK_fe98dacbe692d2a3c83158c7733\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_media\` DROP FOREIGN KEY \`FK_e6bb4a69096db4f6a1f5bada151\``,
    );
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3f16f24f1b961af087fe188b54\` ON \`products\``,
    );
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(`DROP TABLE \`variants\``);
    await queryRunner.query(`DROP TABLE \`variant_value\``);
    await queryRunner.query(`DROP TABLE \`option_variant\``);
    await queryRunner.query(`DROP TABLE \`product_media\``);
  }
}
