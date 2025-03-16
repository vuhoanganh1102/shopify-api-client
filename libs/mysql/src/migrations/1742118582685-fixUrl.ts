import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUrl1742118582685 implements MigrationInterface {
  name = 'FixUrl1742118582685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_5f5615ef4dd53a62ece014d308\` ON \`facebook_member_token\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_media\` DROP COLUMN \`url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_media\` ADD \`url\` longtext NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` ADD UNIQUE INDEX \`IDX_5f5615ef4dd53a62ece014d308\` (\`shopify_user_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` DROP INDEX \`IDX_5f5615ef4dd53a62ece014d308\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_media\` DROP COLUMN \`url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_media\` ADD \`url\` varchar(500) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_5f5615ef4dd53a62ece014d308\` ON \`facebook_member_token\` (\`shopify_user_id\`)`,
    );
  }
}
