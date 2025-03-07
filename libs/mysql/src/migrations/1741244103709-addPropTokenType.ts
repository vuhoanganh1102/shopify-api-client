import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPropTokenType1741244103709 implements MigrationInterface {
  name = 'AddPropTokenType1741244103709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` ADD \`token_type\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` DROP COLUMN \`token_type\``,
    );
  }
}
