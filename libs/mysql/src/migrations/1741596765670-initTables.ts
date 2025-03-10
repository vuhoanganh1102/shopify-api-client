import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1741596765670 implements MigrationInterface {
  name = 'InitTables1741596765670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_media\` (\`id\` bigint UNSIGNED NOT NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`url\` varchar(500) NOT NULL, \`product_id\` bigint UNSIGNED NOT NULL, \`type\` int NOT NULL DEFAULT '0', \`status\` tinyint NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`variants\` (\`id\` bigint UNSIGNED NOT NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`title\` varchar(255) NULL, \`barcode\` varchar(255) NULL, \`sku\` varchar(255) NULL, \`url\` varchar(500) NULL, \`pricing\` decimal(10,2) NULL, \`available\` varchar(255) NULL, \`inventory_quantity\` int NULL, \`old_inventory_quantity\` int NULL, \`option_1\` varchar(255) NULL, \`option_2\` varchar(255) NULL, \`option_3\` varchar(255) NULL, \`product_id\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` bigint UNSIGNED NOT NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`category\` varchar(255) NULL, \`vendor\` varchar(255) NULL, \`pricing\` decimal(10,2) NULL, \`inventory\` int NOT NULL DEFAULT '0', \`quantity\` int NOT NULL DEFAULT '1', \`shipping\` json NULL, \`variants\` json NULL, \`purchase_options\` json NULL, \`metafields\` json NULL, \`search_engine_listing\` json NULL, \`product_status\` varchar(50) NOT NULL DEFAULT 'draft', \`publishing\` json NULL, \`insights\` json NULL, \`product_organization\` json NULL, \`theme_template\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` bigint UNSIGNED NOT NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`category\` int NULL, \`product_id\` bigint UNSIGNED NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`facebook_member_token\` (\`id\` bigint UNSIGNED NOT NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(255) NULL, \`name\` varchar(255) NULL, \`token\` varchar(500) NULL, \`expires_in\` int NULL, \`token_type\` varchar(255) NULL, \`email\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shopify_member_token\` (\`id\` bigint UNSIGNED NOT NULL, \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`shop\` varchar(255) NULL, \`state\` varchar(500) NULL, \`is_online\` varchar(255) NULL, \`scope\` varchar(255) NULL, \`access_token\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_media\` ADD CONSTRAINT \`FK_e6bb4a69096db4f6a1f5bada151\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`variants\` ADD CONSTRAINT \`FK_a9625f5484e6b6941d401ec101c\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`variants\` DROP FOREIGN KEY \`FK_a9625f5484e6b6941d401ec101c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_media\` DROP FOREIGN KEY \`FK_e6bb4a69096db4f6a1f5bada151\``,
    );
    await queryRunner.query(`DROP TABLE \`shopify_member_token\``);
    await queryRunner.query(`DROP TABLE \`facebook_member_token\``);
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(`DROP TABLE \`variants\``);
    await queryRunner.query(`DROP TABLE \`product_media\``);
  }
}
