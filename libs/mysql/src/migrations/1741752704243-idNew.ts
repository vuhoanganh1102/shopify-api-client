import { MigrationInterface, QueryRunner } from 'typeorm';

export class IdNew1741752704243 implements MigrationInterface {
  name = 'IdNew1741752704243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` ADD \`shopify_user_id\` int UNSIGNED NOT NULL`,
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
      `ALTER TABLE \`facebook_member_token\` DROP COLUMN \`shopify_user_id\``,
    );
  }
}
